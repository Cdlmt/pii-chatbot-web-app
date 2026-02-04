import type { SensitiveRange } from "@/lib/types";

export interface TextSegment {
  text: string;
  isSensitive: boolean;
  rangeIndex?: number;
}

export function buildTextSegments(content: string, ranges: SensitiveRange[]): TextSegment[] {
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
