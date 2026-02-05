"use client";

import { MenuIcon } from "./icons";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 md:hidden glass-panel-strong border-b border-(--border)">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg hover:bg-(--background-tertiary) transition-colors"
        >
          <MenuIcon className="w-5 h-5 text-(--foreground-muted)" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-linear-to-br from-black to-(--accent) flex items-center justify-center">
            <span className="text-white text-xs font-semibold">🛡️</span>
          </div>
          <span
            className="text-base font-medium text-foreground"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            PII Chat
          </span>
        </div>

        <div className="w-9" />
      </div>
    </header>
  );
}
