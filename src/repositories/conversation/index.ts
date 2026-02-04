import { prismaConversationRepository } from './prisma';
import { memoryConversationRepository } from './memory';
import type { ConversationRepository } from './interface';

export const conversationRepository: ConversationRepository =
  process.env.REPOSITORY === 'MEMORY'
    ? memoryConversationRepository
    : prismaConversationRepository;

export type { ConversationRepository, RunRequestResult } from './interface';
