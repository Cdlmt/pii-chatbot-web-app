"use client";

import { PlusIcon } from "@/components/ui/icons";

interface SidebarHeaderProps {
  onNewChat: () => void;
}

export function SidebarHeader({ onNewChat }: SidebarHeaderProps) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6 px-2">
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
        onClick={onNewChat}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-(--background-tertiary) border border-(--border) px-4 py-3 text-foreground hover:bg-(--accent-muted) hover:border-(--accent) hover:text-(--accent) transition-all duration-200 group"
      >
        <PlusIcon className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
        <span className="text-sm font-medium">New conversation</span>
      </button>
    </div>
  );
}
