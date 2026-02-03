import { generateText, streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { Message } from './types';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const model = anthropic('claude-sonnet-4-20250514');
export const lightModel = anthropic('claude-3-5-haiku-20241022');

export async function chat(prompt: string, system?: string) {
  const { text } = await generateText({
    model,
    prompt,
    ...(system ? { system } : {}),
  });
  return text;
}

export function chatStream(prompt: string, system?: string) {
  return streamText({
    model,
    prompt,
    ...(system ? { system } : {}),
  });
}

interface StreamOptions {
  onFinish?: (event: { text: string }) => Promise<void> | void;
}

export function chatStreamMessages(
  messages: Message[],
  system?: string,
  options?: StreamOptions
) {
  const modelMessages = messages.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  return streamText({
    model,
    messages: modelMessages,
    ...(system ? { system } : {}),
    ...(options?.onFinish ? { onFinish: options.onFinish } : {}),
  });
}
