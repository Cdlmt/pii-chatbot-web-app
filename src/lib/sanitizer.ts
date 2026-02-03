import { generateText } from 'ai';
import { lightModel } from './llm';
import type { SensitiveRange } from './types';

const SANITIZER_PROMPT = `You are a sensitive information detector. Analyze the given text and identify any sensitive personal information.

Look for:
- Personal names (first names, last names, full names)
- Email addresses
- Phone numbers
- Physical addresses
- Social security numbers
- Credit card numbers
- Dates of birth
- IP addresses
- Account numbers
- Passwords or API keys

Return a JSON array with the exact sensitive text found:
[{"text": "<exact text as it appears>", "type": "<category>"}]

Where:
- "text" is the EXACT sensitive string as it appears in the input (copy it exactly, character by character)
- "type" is the category (e.g., "name", "email", "phone", "address", etc.)

If no sensitive information is found, return an empty array: []

IMPORTANT: Return ONLY the JSON array, no other text or explanation.`;

interface DetectedSensitive {
  text: string;
  type: string;
}

export async function detectSensitiveInfo(
  text: string
): Promise<SensitiveRange[]> {
  if (!text.trim()) {
    return [];
  }

  try {
    const { text: response } = await generateText({
      model: lightModel,
      system: SANITIZER_PROMPT,
      prompt: text,
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return [];
    }

    const detected = JSON.parse(jsonMatch[0]) as DetectedSensitive[];
    const ranges: SensitiveRange[] = [];

    for (const item of detected) {
      if (!item.text || typeof item.text !== 'string') continue;

      let searchStart = 0;
      let index: number;

      while ((index = text.indexOf(item.text, searchStart)) !== -1) {
        ranges.push({
          start: index,
          end: index + item.text.length,
          type: item.type || 'unknown',
        });
        searchStart = index + item.text.length;
      }
    }

    return ranges.sort((a, b) => a.start - b.start);
  } catch (error) {
    console.error('Error detecting sensitive info:', error);
    return [];
  }
}
