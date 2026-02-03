export type MessageRole = 'user' | 'assistant';

export interface SensitiveRange {
  start: number;
  end: number;
  type: string;
}

export interface Message {
  role: MessageRole;
  content: string;
  rawContent?: string;
  sensitiveRanges?: SensitiveRange[];
  createdAt: Date;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationSummary {
  id: string;
  lastMessage: string | null;
  updatedAt: Date;
}
