"use client";

import { BlurredText } from "@/components/blurred-text";
import type { ChatMessage } from "@/hooks/use-streaming-chat";

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} ${
        isUser ? "animate-slide-right" : "animate-slide-left"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className={`max-w-[90%] sm:max-w-[85%] rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 text-sm sm:text-base ${
          isUser
            ? "text-white shadow-md"
            : "bg-(--background-secondary) text-foreground border border-(--border)"
        }`}
        style={isUser ? { background: "var(--user-bubble)" } : undefined}
      >
        {message.role === "assistant" ? (
          <BlurredText
            content={message.content}
            sensitiveRanges={message.sensitiveRanges}
          />
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        )}
      </div>
    </div>
  );
}
