import { prismaConversationRepository } from './prisma-conversation-repository';
import type { ConversationRepository } from './conversation-repository';

export const conversationRepository: ConversationRepository = prismaConversationRepository;
