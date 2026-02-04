"use client";

import { useState, useCallback } from "react";
import type { SensitiveRange } from "@/lib/types";
import { streamReader } from "@/lib/stream-parser";

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

function updateMessage(
  id: string,
  update: Partial<ChatMessage>
): (prev: ChatMessage[]) => ChatMessage[] {
  return (prev) =>
    prev.map((msg) => (msg.id === id ? { ...msg, ...update } : msg));
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
      const assistantMessageId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        userMessage,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, conversationId }),
        });

        if (!response.ok) throw new Error("Failed to send message");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        for await (const { content, sensitiveRanges } of streamReader(reader)) {
          setMessages(updateMessage(assistantMessageId, { content, sensitiveRanges }));
        }

        onComplete?.();
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages(updateMessage(assistantMessageId, { content: "Error: Failed to get response" }));
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, isLoading, onComplete]
  );

  return { messages, sendMessage, isLoading, setMessages };
}
