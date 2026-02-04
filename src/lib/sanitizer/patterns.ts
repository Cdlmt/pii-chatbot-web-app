export interface SensitivePattern {
  pattern: RegExp;
  type: string;
}

export const SENSITIVE_PATTERNS: SensitivePattern[] = [
  // Email addresses
  {
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    type: 'email',
  },
  // Phone numbers (US format)
  {
    pattern: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    type: 'phone',
  },
  // Phone numbers (French format)
  {
    pattern: /(?:\+33|0033|0)[\s.-]?[1-9](?:[\s.-]?\d{2}){4}/g,
    type: 'phone',
  },
  // Social security numbers
  {
    pattern: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
    type: 'ssn',
  },
  // Credit card numbers
  {
    pattern: /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g,
    type: 'credit_card',
  },
  // IP addresses
  {
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    type: 'ip_address',
  },
  // Dates (DD/MM/YYYY or DD-MM-YYYY)
  {
    pattern: /\b(?:0?[1-9]|[12]\d|3[01])[\/\-.](?:0?[1-9]|1[0-2])[\/\-.]\d{4}\b/g,
    type: 'date',
  },
  // Dates (YYYY/MM/DD or YYYY-MM-DD)
  {
    pattern: /\b\d{4}[\/\-.](?:0?[1-9]|1[0-2])[\/\-.](?:0?[1-9]|[12]\d|3[01])\b/g,
    type: 'date',
  },
];

export const SANITIZER_PROMPT = `You are a sensitive information detector. Analyze the given text and identify any sensitive personal information.

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

DO NOT FORGET ANY SENSITIVE INFORMATION.
READ THE TEXT MULTIPLE TIMES CAREFULLY AND IDENTIFY ALL SENSITIVE INFORMATION.

IMPORTANT: Return ONLY the JSON array, no other text or explanation.`;
