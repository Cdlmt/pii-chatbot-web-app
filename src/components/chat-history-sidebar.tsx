"use client";

import type { ConversationSummary } from "@/lib/types";
import { SidebarHeader } from "@/components/sidebar/sidebar-header";
import { ConversationItem } from "@/components/sidebar/conversation-item";
import { EmptyConversations } from "@/components/sidebar/empty-conversations";

interface ChatHistorySidebarProps {
  conversations: ConversationSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void | Promise<void>;
  onNewChat: () => void;
}

export function ChatHistorySidebar({
  conversations,
  selectedId,
  onSelect,
  onNewChat,
}: ChatHistorySidebarProps) {
  return (
    <aside className="w-72 h-screen flex flex-col bg-(--background-secondary) border-r border-(--border)">
      <SidebarHeader onNewChat={onNewChat} />

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {conversations.length === 0 ? (
          <EmptyConversations />
        ) : (
          <div className="space-y-1">
            <p className="text-xs font-medium text-(--foreground-subtle) uppercase tracking-wider px-3 py-2">
              Recent
            </p>
            {conversations.map((conv, index) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedId === conv.id}
                index={index}
                onSelect={() => onSelect(conv.id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
