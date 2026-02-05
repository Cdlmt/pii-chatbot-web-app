"use client";

import { SparkleIcon } from "@/components/ui/icons";

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

const SUGGESTIONS = ["Send me 10 mock address emails", "Send me 10 mock phone numbers", "Send me 10 mock social security numbers"];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] animate-fade-in px-2">
      <div className="relative mb-6 sm:mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-(--accent) to-amber-600 flex items-center justify-center shadow-lg">
          <SparkleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <div className="absolute -inset-4 rounded-3xl bg-(--accent) opacity-20 blur-2xl -z-10" />
      </div>

      <h1
        className="text-2xl sm:text-4xl font-medium mb-2 sm:mb-3 tracking-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        <span className="text-gradient">Hello there</span>
      </h1>
      <p className="text-(--foreground-muted) text-base sm:text-lg text-center max-w-md leading-relaxed px-4">
        Start a conversation, we keep your data private!
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-6 sm:mt-10 justify-center max-w-lg w-full sm:w-auto px-4 sm:px-0">
        {SUGGESTIONS.map((suggestion, i) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-full text-sm text-(--foreground-muted) border border-(--border) hover:border-(--border-hover) hover:text-foreground hover:bg-(--background-secondary) transition-all duration-200 animate-fade-in text-center"
            style={{ animationDelay: `${(i + 1) * 100}ms` }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
