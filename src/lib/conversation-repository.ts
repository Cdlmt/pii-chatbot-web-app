import type { Conversation, ConversationSummary, Message } from './types';

export interface RunRequestResult {
  conversationId: string;
  message: Message;
}

export interface ConversationRepository {
  runRequest(
    prompt: string,
    conversationId?: string,
    system?: string
  ): Promise<RunRequestResult>;

  getOrCreateConversation(conversationId?: string): Promise<Conversation>;

  addMessage(conversationId: string, message: Message): Promise<void>;

  getConversations(): Promise<Conversation[]>;

  getConversation(id: string): Promise<Conversation | undefined>;

  getConversationSummaries(): Promise<ConversationSummary[]>;
}
