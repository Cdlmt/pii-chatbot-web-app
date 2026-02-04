"use client";

import { useState } from "react";
import type { SensitiveRange } from "@/lib/types";
import { ShieldIcon } from "@/components/ui/icons";
import { buildTextSegments, type TextSegment } from "@/lib/text-segments";

interface BlurredTextProps {
  content: string;
  sensitiveRanges?: SensitiveRange[];
}

export function BlurredText({ content, sensitiveRanges = [] }: BlurredTextProps) {
  const [revealedRanges, setRevealedRanges] = useState<Set<number>>(new Set());

  const toggleRange = (rangeIndex: number) => {
    setRevealedRanges((prev) => {
      const next = new Set(prev);
      if (next.has(rangeIndex)) {
        next.delete(rangeIndex);
      } else {
        next.add(rangeIndex);
      }
      return next;
    });
  };

  const segments = buildTextSegments(content, sensitiveRanges);

  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {segments.map((segment: TextSegment, index: number) => {
        if (!segment.isSensitive) {
          return <span key={index}>{segment.text}</span>;
        }

        const isRevealed = revealedRanges.has(segment.rangeIndex!);

        return (
          <span
            key={index}
            onClick={() => toggleRange(segment.rangeIndex!)}
            className={`
              relative cursor-pointer rounded-md px-1 py-0.5 mx-0.5
              transition-all duration-300 ease-out
              inline-flex items-center gap-1
              ${isRevealed
                ? "bg-(--accent-muted) text-foreground"
                : "bg-(--background-tertiary) text-transparent select-none hover:bg-(--accent-muted)/50"
              }
            `}
            style={{
              filter: isRevealed ? "none" : "blur(5px)",
            }}
            title={isRevealed ? "Click to protect" : "Click to reveal sensitive data"}
          >
            {!isRevealed && (
              <ShieldIcon className="w-3 h-3 text-(--accent) absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80" style={{ filter: "none" }} />
            )}
            {segment.text}
          </span>
        );
      })}
    </span>
  );
}
