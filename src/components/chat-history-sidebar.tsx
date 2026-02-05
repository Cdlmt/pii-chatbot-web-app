"use client";

import type { ConversationSummary } from "@/lib/types";
import { SidebarHeader } from "@/components/sidebar/sidebar-header";
import { ConversationItem } from "@/components/sidebar/conversation-item";
import { EmptyConversations } from "@/components/sidebar/empty-conversations";
import { CloseIcon } from "@/components/ui/icons";

interface ChatHistorySidebarProps {
  conversations: ConversationSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void | Promise<void>;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatHistorySidebar({
  conversations,
  selectedId,
  onSelect,
  onNewChat,
  isOpen,
  onClose,
}: ChatHistorySidebarProps) {
  async function handleSelect(id: string) {
    await onSelect(id);
    onClose();
  }

  function handleNewChat() {
    onNewChat();
    onClose();
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          w-72 h-screen flex flex-col bg-(--background-secondary) border-r border-(--border)
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-black to-(--accent) flex items-center justify-center">
              <span className="text-white text-sm font-semibold">🛡️</span>
            </div>
            <h1
              className="text-lg font-medium text-foreground"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              PII Chat
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-(--background-tertiary) transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-(--foreground-muted)" />
          </button>
        </div>

        <div className="hidden md:block">
          <SidebarHeader onNewChat={handleNewChat} />
        </div>

        <div className="md:hidden px-4 pb-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-(--background-tertiary) border border-(--border) px-4 py-3 text-foreground hover:bg-(--accent-muted) hover:border-(--accent) hover:text-(--accent) transition-all duration-200"
          >
            <span className="text-sm font-medium">New conversation</span>
          </button>
        </div>

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
                  onSelect={() => handleSelect(conv.id)}
                />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
