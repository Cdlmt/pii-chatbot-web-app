import { generateText } from 'ai';
import { lightModel } from '../llm';
import { SENSITIVE_PATTERNS, SANITIZER_PROMPT } from './patterns';
import type { SensitiveRange } from '../types';

interface DetectedSensitive {
  text: string;
  type: string;
}

function createRangeKey(range: SensitiveRange): string {
  return `${range.start}-${range.end}`;
}

function deduplicateAndSort(ranges: SensitiveRange[]): SensitiveRange[] {
  const seen = new Set<string>();
  const unique = ranges.filter((range) => {
    const key = createRangeKey(range);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique.sort((a, b) => a.start - b.start);
}

function findAllOccurrences(
  text: string,
  search: string,
  type: string
): SensitiveRange[] {
  const ranges: SensitiveRange[] = [];
  let index = 0;

  while ((index = text.indexOf(search, index)) !== -1) {
    ranges.push({ start: index, end: index + search.length, type });
    index += search.length;
  }

  return ranges;
}

function parseDetectedItems(response: string): DetectedSensitive[] {
  const jsonMatch = response.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    return JSON.parse(jsonMatch[0]) as DetectedSensitive[];
  } catch {
    return [];
  }
}

export function detectSensitiveInfoSync(text: string): SensitiveRange[] {
  if (!text.trim()) return [];

  const ranges: SensitiveRange[] = [];

  for (const { pattern, type } of SENSITIVE_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;

    while ((match = regex.exec(text)) !== null) {
      ranges.push({
        start: match.index,
        end: match.index + match[0].length,
        type,
      });
    }
  }

  return deduplicateAndSort(ranges);
}

export function mergeRanges(
  existingRanges: SensitiveRange[],
  newRanges: SensitiveRange[]
): SensitiveRange[] {
  return deduplicateAndSort([...existingRanges, ...newRanges]);
}

export async function detectSensitiveInfo(
  text: string
): Promise<SensitiveRange[]> {
  if (!text.trim()) return [];

  try {
    const { text: response } = await generateText({
      model: lightModel,
      system: SANITIZER_PROMPT,
      prompt: text,
    });

    const detected = parseDetectedItems(response);
    const ranges = detected
      .filter((item) => item.text && typeof item.text === 'string')
      .flatMap((item) =>
        findAllOccurrences(text, item.text, item.type || 'unknown')
      );

    return deduplicateAndSort(ranges);
  } catch (error) {
    console.error('Error detecting sensitive info:', error);
    return [];
  }
}
