"use client";

import { forwardRef } from "react";
import { MessageBubble } from "./message-bubble";
import { LoadingDots } from "@/components/ui/loading-dots";
import type { ChatMessage } from "@/hooks/use-streaming-chat";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  function MessageList({ messages, isLoading }, ref) {
    const showLoadingIndicator = isLoading && messages[messages.length - 1]?.role === "user";

    return (
      <div className="space-y-6 pb-32">
        {messages.map((message, index) => (
          <MessageBubble key={message.id} message={message} index={index} />
        ))}

        {showLoadingIndicator && (
          <div className="flex justify-start animate-slide-left">
            <div className="bg-(--background-secondary) border border-(--border) rounded-2xl px-5 py-4">
              <LoadingDots />
            </div>
          </div>
        )}

        <div ref={ref} />
      </div>
    );
  }
);
