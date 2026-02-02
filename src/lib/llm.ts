import { generateText, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const model = anthropic("claude-sonnet-4-20250514");

export async function chat(prompt: string, system?: string) {
  const { text } = await generateText({
    model,
    system,
    prompt,
  });
  return text;
}

export function chatStream(prompt: string, system?: string) {
  return streamText({
    model,
    system,
    prompt,
  });
}
