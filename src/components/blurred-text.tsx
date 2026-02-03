"use client";

import { useState } from "react";
import type { SensitiveRange } from "@/lib/types";

interface BlurredTextProps {
  content: string;
  sensitiveRanges?: SensitiveRange[];
}

interface TextSegment {
  text: string;
  isSensitive: boolean;
  rangeIndex?: number;
}

function buildSegments(
  content: string,
  ranges: SensitiveRange[]
): TextSegment[] {
  if (ranges.length === 0) {
    return [{ text: content, isSensitive: false }];
  }

  const sortedRanges = [...ranges].sort((a, b) => a.start - b.start);
  const segments: TextSegment[] = [];
  let currentIndex = 0;

  sortedRanges.forEach((range, index) => {
    if (range.start > currentIndex) {
      segments.push({
        text: content.slice(currentIndex, range.start),
        isSensitive: false,
      });
    }

    segments.push({
      text: content.slice(range.start, range.end),
      isSensitive: true,
      rangeIndex: index,
    });

    currentIndex = range.end;
  });

  if (currentIndex < content.length) {
    segments.push({
      text: content.slice(currentIndex),
      isSensitive: false,
    });
  }

  return segments;
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

  const segments = buildSegments(content, sensitiveRanges);

  return (
    <span className="whitespace-pre-wrap">
      {segments.map((segment, index) => {
        if (!segment.isSensitive) {
          return <span key={index}>{segment.text}</span>;
        }

        const isRevealed = revealedRanges.has(segment.rangeIndex!);

        return (
          <span
            key={index}
            onClick={() => toggleRange(segment.rangeIndex!)}
            className={`cursor-pointer transition-all duration-200 rounded px-0.5 ${
              isRevealed
                ? "bg-yellow-200 dark:bg-yellow-800"
                : "bg-gray-300 dark:bg-gray-600 select-none"
            }`}
            style={{
              filter: isRevealed ? "none" : "blur(4px)",
            }}
            title={isRevealed ? "Click to hide" : "Click to reveal"}
          >
            {segment.text}
          </span>
        );
      })}
    </span>
  );
}
