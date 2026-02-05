"use client";

import { ChatHistorySidebar } from "@/components/chat-history-sidebar";
import { EmptyState } from "@/components/chat/empty-state";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { MobileHeader } from "@/components/ui/mobile-header";
import { useConversations } from "@/hooks/use-conversations";
import { useStreamingChat } from "@/hooks/use-streaming-chat";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [conversationId, setConversationId] = useState(() => crypto.randomUUID());
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { conversations, fetchConversations, loadConversation } = useConversations();
  const { messages, sendMessage, isLoading, setMessages } = useStreamingChat({
    conversationId,
    onComplete: fetchConversations,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [conversationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    await sendMessage(message);
  }

  async function handleSelectConversation(id: string) {
    if (id === conversationId) return;

    const loadedMessages = await loadConversation(id);
    if (loadedMessages) {
      setMessages(loadedMessages);
      setConversationId(id);
    }
  }

  function handleNewChat() {
    setConversationId(crypto.randomUUID());
    setMessages([]);
  }

  return (
    <div className="flex h-screen bg-background">
      <ChatHistorySidebar
        conversations={conversations}
        selectedId={conversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex flex-col flex-1 relative min-w-0">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 -right-32 w-96 h-96 rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.02]"
            style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
          />
        </div>

        <div className="flex-1 overflow-y-auto relative pt-14 md:pt-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {messages.length === 0 ? (
              <EmptyState onSuggestionClick={setInput} />
            ) : (
              <MessageList ref={messagesEndRef} messages={messages} isLoading={isLoading} />
            )}
          </div>
        </div>

        <ChatInput
          ref={inputRef}
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
