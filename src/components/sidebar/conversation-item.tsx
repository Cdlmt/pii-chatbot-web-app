"use client";

import type { ConversationSummary } from "@/lib/types";
import { formatRelativeDate, truncateText } from "@/lib/utils";

interface ConversationItemProps {
  conversation: ConversationSummary;
  isSelected: boolean;
  index: number;
  onSelect: () => void;
}

export function ConversationItem({ conversation, isSelected, index, onSelect }: ConversationItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 group animate-fade-in ${
        isSelected
          ? "bg-(--accent-muted) border border-(--accent)/30"
          : "hover:bg-(--background-tertiary) border border-transparent"
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-2 h-2 rounded-full shrink-0 transition-colors duration-200 ${
            isSelected
              ? "bg-(--accent)"
              : "bg-(--foreground-subtle) group-hover:bg-(--foreground-muted)"
          }`}
        />
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm truncate transition-colors duration-200 ${
              isSelected
                ? "text-foreground font-medium"
                : "text-(--foreground-muted) group-hover:text-foreground"
            }`}
          >
            {conversation.lastMessage ? truncateText(conversation.lastMessage) : "Empty conversation"}
          </p>
          <p className="text-xs text-(--foreground-subtle) mt-1">
            {formatRelativeDate(new Date(conversation.updatedAt))}
          </p>
        </div>
      </div>
    </button>
  );
}
