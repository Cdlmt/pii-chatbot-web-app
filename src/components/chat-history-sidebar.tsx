"use client";

import type { ConversationSummary } from "@/lib/types";

interface ChatHistorySidebarProps {
  conversations: ConversationSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void | Promise<void>;
  onNewChat: () => void;
}

function truncateText(text: string, maxLength: number = 30): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function ChatHistorySidebar({
  conversations,
  selectedId,
  onSelect,
  onNewChat,
}: ChatHistorySidebarProps) {
  return (
    <aside className="w-64 h-screen border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onNewChat}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="text-center text-gray-500 text-sm p-4">
            No conversations yet
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {conversations.map((conv) => (
              <li key={conv.id}>
                <button
                  onClick={() => onSelect(conv.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                    selectedId === conv.id
                      ? "bg-gray-100 dark:bg-gray-800"
                      : ""
                  }`}
                >
                  <p className="text-sm font-medium text-foreground truncate">
                    {conv.lastMessage
                      ? truncateText(conv.lastMessage)
                      : "Empty conversation"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
