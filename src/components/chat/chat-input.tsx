"use client";

import { forwardRef } from "react";
import { SendIcon } from "@/components/ui/icons";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  function ChatInput({ value, onChange, onSubmit, isLoading }, ref) {
    return (
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-linear-to-t from-background via-background to-transparent pointer-events-none" />

        <form onSubmit={onSubmit} className="relative max-w-3xl mx-auto">
          <div className="glass-panel-strong rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl focus-within:shadow-xl focus-within:border-(--border-hover)">
            <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2">
              <input
                ref={ref}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-foreground placeholder:text-(--foreground-subtle) focus:outline-none text-sm sm:text-base"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !value.trim()}
                className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl transition-all duration-200 shrink-0 ${
                  value.trim() && !isLoading
                    ? "bg-linear-to-br from-(--accent) to-amber-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                    : "bg-(--background-tertiary) text-(--foreground-subtle) cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <SendIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          <p className="hidden sm:block text-center text-xs text-(--foreground-subtle) mt-3">
            Press Enter to send • Sensitive data is automatically protected
          </p>
        </form>
      </div>
    );
  }
);
