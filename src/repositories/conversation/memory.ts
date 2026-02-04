import { chat } from '@/lib/llm';
import type { ConversationRepository } from './interface';
import type { Conversation, ConversationSummary, Message } from '@/lib/types';

declare global {
  var conversationsStore: Map<string, Conversation> | undefined;
}

const conversations =
  globalThis.conversationsStore ?? new Map<string, Conversation>();

if (process.env.NODE_ENV !== 'production') {
  globalThis.conversationsStore = conversations;
}

export const memoryConversationRepository: ConversationRepository = {
  async getOrCreateConversation(conversationId) {
    if (conversationId) {
      const existing = conversations.get(conversationId);
      if (existing) return existing;
    }

    const now = new Date();
    const newId = conversationId ?? crypto.randomUUID();
    const conversation: Conversation = {
      id: newId,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    conversations.set(newId, conversation);
    return conversation;
  },

  async addMessage(conversationId, message) {
    const conversation = conversations.get(conversationId);
    if (conversation) {
      conversation.messages.push(message);
      conversation.updatedAt = new Date();
    }
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
    return Array.from(conversations.values());
  },

  async getConversation(id) {
    return conversations.get(id);
  },

  async getConversationSummaries(): Promise<ConversationSummary[]> {
    return Array.from(conversations.values())
      .map((conv) => {
        const lastMsg = conv.messages[conv.messages.length - 1];
        return {
          id: conv.id,
          lastMessage: lastMsg?.content ?? null,
          updatedAt: conv.updatedAt,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  },
};
