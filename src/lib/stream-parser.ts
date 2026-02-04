import type { SensitiveRange } from './types';

export const SENSITIVE_MARKER = '\n[SENSITIVE_RANGES]';
export const SENSITIVE_UPDATE_MARKER = '\n[SENSITIVE_UPDATE]';

export interface ParsedStreamContent {
  content: string;
  sensitiveRanges?: SensitiveRange[];
}

function findJsonArrayEnd(str: string, startIndex: number): number {
  if (str[startIndex] !== '[') return -1;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIndex; i < str.length; i++) {
    const char = str[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '[') {
      depth++;
    } else if (char === ']') {
      depth--;
      if (depth === 0) {
        return i + 1;
      }
    }
  }

  return -1;
}

function extractFinalMarker(content: string): {
  content: string;
  ranges?: SensitiveRange[];
} {
  const markerIndex = content.indexOf(SENSITIVE_MARKER);
  if (markerIndex === -1) {
    return { content };
  }

  const jsonStart = markerIndex + SENSITIVE_MARKER.length;
  const jsonEnd = findJsonArrayEnd(content, jsonStart);

  if (jsonEnd === -1) {
    return { content: content.slice(0, markerIndex) };
  }

  try {
    const ranges = JSON.parse(content.slice(jsonStart, jsonEnd)) as SensitiveRange[];
    return {
      content: content.slice(0, markerIndex) + content.slice(jsonEnd),
      ranges,
    };
  } catch {
    return { content: content.slice(0, markerIndex) + content.slice(jsonEnd) };
  }
}

function extractUpdateMarkers(content: string): {
  content: string;
  ranges?: SensitiveRange[];
} {
  let incrementalRanges: SensitiveRange[] | undefined;
  let searchStart = 0;
  const partsToKeep: string[] = [];
  let lastEnd = 0;

  while (true) {
    const markerIndex = content.indexOf(SENSITIVE_UPDATE_MARKER, searchStart);
    if (markerIndex === -1) break;

    const jsonStart = markerIndex + SENSITIVE_UPDATE_MARKER.length;
    const jsonEnd = findJsonArrayEnd(content, jsonStart);

    if (jsonEnd === -1) {
      partsToKeep.push(content.slice(lastEnd, markerIndex));
      return { content: partsToKeep.join(''), ranges: incrementalRanges };
    }

    try {
      incrementalRanges = JSON.parse(content.slice(jsonStart, jsonEnd)) as SensitiveRange[];
    } catch {
      // Ignore parse errors
    }

    partsToKeep.push(content.slice(lastEnd, markerIndex));
    lastEnd = jsonEnd;
    searchStart = jsonEnd;
  }

  partsToKeep.push(content.slice(lastEnd));
  return { content: partsToKeep.join(''), ranges: incrementalRanges };
}

export function parseStreamContent(fullContent: string): ParsedStreamContent {
  const finalResult = extractFinalMarker(fullContent);
  const updateResult = extractUpdateMarkers(finalResult.content);

  return {
    content: updateResult.content,
    sensitiveRanges: finalResult.ranges ?? updateResult.ranges,
  };
}

export async function* streamReader(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<ParsedStreamContent> {
  const decoder = new TextDecoder();
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    fullContent += decoder.decode(value, { stream: true });
    yield parseStreamContent(fullContent);
  }
}
