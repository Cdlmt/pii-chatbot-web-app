import { prismaConversationRepository } from './prisma-conversation-repository';
import type { ConversationRepository } from './conversation-repository';
import { memoryConversationRepository } from './memory-conversation-repository';

export const conversationRepository: ConversationRepository =
  process.env.REPOSITORY === 'MEMORY'
    ? memoryConversationRepository
    : prismaConversationRepository;
