"use client";

import { BlurredText } from "@/components/blurred-text";
import { ChatHistorySidebar } from "@/components/chat-history-sidebar";
import { useConversations } from "@/hooks/use-conversations";
import { useStreamingChat } from "@/hooks/use-streaming-chat";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [conversationId, setConversationId] = useState(() => crypto.randomUUID());
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { conversations, fetchConversations, loadConversation } = useConversations();
  const { messages, sendMessage, isLoading, setMessages } = useStreamingChat({
    conversationId,
    onComplete: fetchConversations,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="flex h-screen">
      <ChatHistorySidebar
        conversations={conversations}
        selectedId={conversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      <div className="flex flex-col flex-1 max-w-2xl mx-auto">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              Send a message to start the conversation
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-foreground"
                }`}
              >
                {message.role === "assistant" ? (
                  <BlurredText
                    content={message.content}
                    sensitiveRanges={message.sensitiveRanges}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 dark:border-gray-800 p-4"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
