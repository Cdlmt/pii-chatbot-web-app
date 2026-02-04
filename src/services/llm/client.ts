import { createAnthropic } from '@ai-sdk/anthropic';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const model = anthropic('claude-sonnet-4-20250514');
export const lightModel = anthropic('claude-3-5-haiku-20241022');
