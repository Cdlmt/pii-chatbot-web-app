"use client";

import { useState, useCallback } from "react";
import type { SensitiveRange } from "@/lib/types";

const SENSITIVE_MARKER = "\n[SENSITIVE_RANGES]";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sensitiveRanges?: SensitiveRange[];
}

interface UseStreamingChatOptions {
  conversationId: string;
  initialMessages?: ChatMessage[];
  onComplete?: () => void;
}

interface UseStreamingChatReturn {
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

function parseStreamContent(fullContent: string): {
  content: string;
  sensitiveRanges?: SensitiveRange[];
} {
  const markerIndex = fullContent.indexOf(SENSITIVE_MARKER);
  if (markerIndex === -1) {
    return { content: fullContent };
  }

  const content = fullContent.slice(0, markerIndex);
  const rangesJson = fullContent.slice(markerIndex + SENSITIVE_MARKER.length);

  try {
    const sensitiveRanges = JSON.parse(rangesJson) as SensitiveRange[];
    return { content, sensitiveRanges };
  } catch {
    return { content };
  }
}

export function useStreamingChat({
  conversationId,
  initialMessages = [],
  onComplete,
}: UseStreamingChatOptions): UseStreamingChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const assistantMessageId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);

      let fullContent = "";

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, conversationId }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;

          const { content, sensitiveRanges } = parseStreamContent(fullContent);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content, sensitiveRanges }
                : msg
            )
          );
        }

        onComplete?.();
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: "Error: Failed to get response" }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, isLoading, onComplete]
  );

  return { messages, sendMessage, isLoading, setMessages };
}
