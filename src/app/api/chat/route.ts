import { conversationRepository } from '@/lib/repository';
import { chatStreamMessages } from '@/lib/llm';
import { detectSensitiveInfo } from '@/lib/sanitizer';
import type { Message } from '@/lib/types';

export const SENSITIVE_MARKER = '\n[SENSITIVE_RANGES]';

export async function POST(req: Request) {
  const { message, conversationId } = await req.json();

  if (!message) {
    return new Response('Message is required', { status: 400 });
  }

  const conversation =
    await conversationRepository.getOrCreateConversation(conversationId);

  const userMessage: Message = {
    role: 'user',
    content: message,
    createdAt: new Date(),
  };
  await conversationRepository.addMessage(conversation.id, userMessage);

  const updatedConversation = await conversationRepository.getConversation(
    conversation.id
  );
  const messages = updatedConversation?.messages || [];

  const result = chatStreamMessages(messages);

  const encoder = new TextEncoder();
  let fullText = '';

  const stream = new ReadableStream({
    async start(controller) {
      const reader = result.textStream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          fullText += value;
          controller.enqueue(encoder.encode(value));
        }

        const sensitiveRanges = await detectSensitiveInfo(fullText);

        const assistantMessage: Message = {
          role: 'assistant',
          content: fullText,
          rawContent: fullText,
          sensitiveRanges,
          createdAt: new Date(),
        };
        await conversationRepository.addMessage(
          conversation.id,
          assistantMessage
        );

        controller.enqueue(
          encoder.encode(SENSITIVE_MARKER + JSON.stringify(sensitiveRanges))
        );
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
