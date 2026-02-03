import { Prisma } from '@prisma/client';
import { prisma } from './prisma';
import { chat } from './llm';
import type { ConversationRepository } from './conversation-repository';
import type {
  Conversation,
  ConversationSummary,
  Message,
  SensitiveRange,
} from './types';

function mapPrismaMessageToMessage(
  prismaMessage: {
    id: string;
    role: string;
    content: string;
    rawContent: string | null;
    sensitiveRanges: unknown;
    createdAt: Date;
  }
): Message {
  return {
    role: prismaMessage.role as 'user' | 'assistant',
    content: prismaMessage.content,
    rawContent: prismaMessage.rawContent ?? undefined,
    sensitiveRanges: prismaMessage.sensitiveRanges as SensitiveRange[] | undefined,
    createdAt: prismaMessage.createdAt,
  };
}

function mapPrismaConversationToConversation(
  prismaConversation: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Array<{
      id: string;
      role: string;
      content: string;
      rawContent: string | null;
      sensitiveRanges: unknown;
      createdAt: Date;
    }>;
  }
): Conversation {
  return {
    id: prismaConversation.id,
    createdAt: prismaConversation.createdAt,
    updatedAt: prismaConversation.updatedAt,
    messages: prismaConversation.messages.map(mapPrismaMessageToMessage),
  };
}

export const prismaConversationRepository: ConversationRepository = {
  async getOrCreateConversation(conversationId) {
    if (conversationId) {
      const existing = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
      if (existing) {
        return mapPrismaConversationToConversation(existing);
      }
    }

    const newId = conversationId ?? crypto.randomUUID();
    const conversation = await prisma.conversation.create({
      data: { id: newId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    return mapPrismaConversationToConversation(conversation);
  },

  async addMessage(conversationId, message) {
    await prisma.message.create({
      data: {
        role: message.role,
        content: message.content,
        rawContent: message.rawContent ?? null,
        sensitiveRanges: message.sensitiveRanges
          ? (message.sensitiveRanges as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        createdAt: message.createdAt,
        conversationId,
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
  },

  async runRequest(prompt, conversationId, system) {
    const conversation = await this.getOrCreateConversation(conversationId);

    const userMessage: Message = {
      role: 'user',
      content: prompt,
      createdAt: new Date(),
    };
    await this.addMessage(conversation.id, userMessage);

    const responseText = await chat(prompt, system);

    const assistantMessage: Message = {
      role: 'assistant',
      content: responseText,
      createdAt: new Date(),
    };
    await this.addMessage(conversation.id, assistantMessage);

    return {
      conversationId: conversation.id,
      message: assistantMessage,
    };
  },

  async getConversations() {
    const conversations = await prisma.conversation.findMany({
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map(mapPrismaConversationToConversation);
  },

  async getConversation(id) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!conversation) return undefined;

    return mapPrismaConversationToConversation(conversation);
  },

  async getConversationSummaries(): Promise<ConversationSummary[]> {
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conv) => ({
      id: conv.id,
      lastMessage: conv.messages[0]?.content ?? null,
      updatedAt: conv.updatedAt,
    }));
  },
};
