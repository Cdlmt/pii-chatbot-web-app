import { generateText, streamText } from 'ai';
import { model } from './client';
import type { Message } from '@/lib/types';

interface StreamOptions {
  onFinish?: (event: { text: string }) => Promise<void> | void;
}

export async function chat(prompt: string, system?: string): Promise<string> {
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
