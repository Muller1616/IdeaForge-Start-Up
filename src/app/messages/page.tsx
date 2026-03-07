"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Search, Send, MoreVertical } from "lucide-react";
import { toast } from "sonner";

// Mock conversations
const mockConversations = [
  {
    id: "1",
    user: { name: "Sarah Kim", avatar: null },
    lastMessage: "That sounds great! When can we schedule a call?",
    timestamp: "2m ago",
    unread: true,
  },
  {
    id: "2",
    user: { name: "Mike Johnson", avatar: null },
    lastMessage: "I'd love to join your team as a designer.",
    timestamp: "1h ago",
    unread: false,
  },
  {
    id: "3",
    user: { name: "Emma Wilson", avatar: null },
    lastMessage: "Thanks for the feedback on my idea!",
    timestamp: "Yesterday",
    unread: false,
  },
];

const mockMessages = [
  { id: "1", sender: "them", content: "Hi! I'm interested in your AI Code Review idea.", time: "10:30 AM" },
  { id: "2", sender: "me", content: "Great to hear! What's your background?", time: "10:32 AM" },
  { id: "3", sender: "them", content: "I'm a senior developer with 8 years of experience.", time: "10:35 AM" },
  { id: "4", sender: "them", content: "That sounds great! When can we schedule a call?", time: "10:36 AM" },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState("1");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Type a message first.");
      return;
    }
    // TODO: API call
    setMessage("");
    toast.success("Message sent.");
  };

  const currentChat = mockConversations.find((c) => c.id === selectedChat);

  return (
    <main className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold text-[var(--color-text)]">
          Messages
        </h1>

        <div className="flex h-[600px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          {/* Conversation list */}
          <div className="flex w-80 flex-shrink-0 flex-col border-r border-[var(--color-border)]">
            <div className="border-b border-[var(--color-border)] p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`flex w-full items-center gap-4 border-b border-[var(--color-border)] p-4 text-left transition-colors hover:bg-[var(--color-surface-hover)] ${
                    selectedChat === conv.id
                      ? "bg-[var(--color-surface-hover)]"
                      : ""
                  }`}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-lg font-semibold text-white">
                    {conv.user.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-medium ${
                          conv.unread ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"
                        }`}
                      >
                        {conv.user.name}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {conv.timestamp}
                      </span>
                    </div>
                    <p className="truncate text-sm text-[var(--color-text-muted)]">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && (
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--color-primary)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex flex-1 flex-col">
            {currentChat ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-sm font-semibold text-white">
                      {currentChat.user.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-semibold text-[var(--color-text)]">
                        {currentChat.user.name}
                      </h2>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Online
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {mockMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.sender === "me"
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[var(--color-surface-hover)] text-[var(--color-text)]"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`mt-1 text-xs ${
                            msg.sender === "me"
                              ? "text-white/80"
                              : "text-[var(--color-text-muted)]"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="border-t border-[var(--color-border)] p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                    <Button onClick={handleSend} size="icon" className="h-12 w-12">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-surface-hover)]">
                  <Send className="h-10 w-10 text-[var(--color-text-muted)]" />
                </div>
                <p className="text-[var(--color-text-muted)]">
                  Select a conversation to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
