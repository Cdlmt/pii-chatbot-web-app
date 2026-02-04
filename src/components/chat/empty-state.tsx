"use client";

import { SparkleIcon } from "@/components/ui/icons";

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

const SUGGESTIONS = ["Send me 10 mock address emails", "Send me 10 mock phone numbers", "Send me 10 mock social security numbers"];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-(--accent) to-amber-600 flex items-center justify-center shadow-lg">
          <SparkleIcon className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -inset-4 rounded-3xl bg-(--accent) opacity-20 blur-2xl -z-10" />
      </div>

      <h1
        className="text-4xl font-medium mb-3 tracking-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        <span className="text-gradient">Hello there</span>
      </h1>
      <p className="text-(--foreground-muted) text-lg text-center max-w-md leading-relaxed">
        Start a conversation, we keep your data private!
      </p>

      <div className="flex flex-wrap gap-2 mt-10 justify-center max-w-lg">
        {SUGGESTIONS.map((suggestion, i) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-2 rounded-full text-sm text-(--foreground-muted) border border-(--border) hover:border-(--border-hover) hover:text-foreground hover:bg-(--background-secondary) transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${(i + 1) * 100}ms` }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
