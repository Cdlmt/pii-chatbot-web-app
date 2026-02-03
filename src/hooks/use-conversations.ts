"use client";

import { useState, useCallback, useEffect } from "react";
import type { ConversationSummary } from "@/lib/types";
import type { ChatMessage } from "./use-streaming-chat";

interface UseConversationsReturn {
  conversations: ConversationSummary[];
  fetchConversations: () => Promise<void>;
  loadConversation: (id: string) => Promise<ChatMessage[] | null>;
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }, []);

  const loadConversation = useCallback(async (id: string): Promise<ChatMessage[] | null> => {
    try {
      const response = await fetch(`/api/conversations/${id}`);
      if (response.ok) {
        const data = await response.json();
        return data.messages.map(
          (msg: { role: "user" | "assistant"; content: string; sensitiveRanges?: Array<{ start: number; end: number; type: string }> }) => ({
            id: crypto.randomUUID(),
            role: msg.role,
            content: msg.content,
            sensitiveRanges: msg.sensitiveRanges,
          })
        );
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
    return null;
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, fetchConversations, loadConversation };
}
