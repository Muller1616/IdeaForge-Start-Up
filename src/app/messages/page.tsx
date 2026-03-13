"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { Search, Send, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { InlineNotification } from "@/components/ui/InlineNotification";
import { ConfirmDeletePopup } from "@/components/ui/ConfirmDeletePopup";
import { getOtherUsers, editMessageAction, deleteMessageAction } from "@/lib/messageActions";
import {
  getMessagesForUser,
  getMessagesBetween,
  sendMessage,
  type Message,
} from "@/lib/messages";
import type { User } from "@/lib/db";

function timeAgo(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const s = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString();
}

function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type ConversationEntry = {
  user: User;
  lastMessage: string | null;
  lastAt: string | null;
};

export default function MessagesPage() {
  const { user: currentUser } = useAuth();
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageContent, setEditMessageContent] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [notification, setNotification] = useState<{ type: "error" | "success" | "warning"; message: string } | null>(null);
  const [pendingDeleteMessage, setPendingDeleteMessage] = useState<Message | null>(null);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoadingConvos(true);
    try {
      const [users, myMessages] = await Promise.all([
        getOtherUsers(),
        getMessagesForUser(currentUser.id),
      ]);
      const byOther: Record<string, { content: string; createdAt: string }> = {};
      for (const m of myMessages) {
        const other = m.senderId === currentUser.id ? m.receiverId : m.senderId;
        if (!byOther[other] || new Date(m.createdAt) > new Date(byOther[other].createdAt)) {
          byOther[other] = { content: m.content, createdAt: m.createdAt };
        }
      }
      const list: ConversationEntry[] = users.map((u) => ({
        user: u,
        lastMessage: byOther[u.id]?.content ?? null,
        lastAt: byOther[u.id]?.createdAt ?? null,
      }));
      list.sort((a, b) => {
        if (!a.lastAt) return 1;
        if (!b.lastAt) return -1;
        return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime();
      });
      setOtherUsers(users);
      setConversations(list);
    } finally {
      setLoadingConvos(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!currentUser?.id || !selectedUserId) {
      setThreadMessages([]);
      return;
    }
    setLoadingThread(true);
    getMessagesBetween(currentUser.id, selectedUserId)
      .then(setThreadMessages)
      .finally(() => setLoadingThread(false));
  }, [currentUser?.id, selectedUserId]);

  const selectedUser = selectedUserId
    ? otherUsers.find((u) => u.id === selectedUserId)
    : null;

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || !currentUser?.id || !selectedUserId) {
      if (!trimmed) setNotification({ type: "warning", message: "Type a message first." });
      return;
    }
    setSending(true);
    try {
      const result = await sendMessage(currentUser.id, selectedUserId, trimmed);
      if ("error" in result) {
        setNotification({ type: "error", message: result.error });
        return;
      }
      setMessage("");
      setNotification({ type: "success", message: "Message sent." });
      setThreadMessages((prev) => [...prev, result]);
      loadConversations();
    } finally {
      setSending(false);
    }
  };

  const handleStartEditMessage = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditMessageContent(msg.content);
  };

  const handleCancelEditMessage = () => {
    setEditingMessageId(null);
    setEditMessageContent("");
  };

  const handleSaveEditMessage = async () => {
    if (!editingMessageId || !editMessageContent.trim()) return;
    setLoadingEdit(true);
    try {
      const result = await editMessageAction(editingMessageId, editMessageContent.trim());
      if (result.error) {
        setNotification({ type: "error", message: result.error });
        return;
      }
      if (result.message) {
        setThreadMessages((prev) =>
          prev.map((m) => (m.id === result.message!.id ? { ...m, content: result.message!.content } : m))
        );
        setEditingMessageId(null);
        setEditMessageContent("");
        setNotification({ type: "success", message: "Message updated." });
        loadConversations();
      }
    } catch {
      setNotification({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDeleteMessage = async (msg: Message) => {
    setIsDeletingMessage(true);
    try {
      const result = await deleteMessageAction(msg.id);
      if (result.error) {
        setNotification({ type: "error", message: result.error });
        setPendingDeleteMessage(null);
        return;
      }
      setThreadMessages((prev) => prev.filter((m) => m.id !== msg.id));
      setEditingMessageId((id) => (id === msg.id ? null : id));
      setPendingDeleteMessage(null);
      setNotification({ type: "success", message: "Message deleted." });
      loadConversations();
    } catch {
      setNotification({ type: "error", message: "Something went wrong. Please try again." });
      setPendingDeleteMessage(null);
    } finally {
      setIsDeletingMessage(false);
    }
  };

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <BackButton fallbackHref="/">Back</BackButton>
          <h1 className="mb-8 text-2xl font-bold text-[var(--color-text)]">Messages</h1>
          <p className="text-[var(--color-text-muted)]">Sign in to view and send messages.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackHref="/">Back</BackButton>
        </div>
        <h1 className="mb-8 text-2xl font-bold text-[var(--color-text)]">Messages</h1>

        {notification && (
          <div className="mb-6">
            <InlineNotification
              type={notification.type}
              message={notification.message}
              onDismiss={() => setNotification(null)}
              autoDismissSeconds={5}
            />
          </div>
        )}

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
              {loadingConvos ? (
                <p className="p-4 text-sm text-[var(--color-text-muted)]">Loading…</p>
              ) : conversations.length === 0 ? (
                <p className="p-4 text-sm text-[var(--color-text-muted)]">
                  No conversations yet. Select a user to start.
                </p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.user.id}
                    onClick={() => setSelectedUserId(conv.user.id)}
                    className={`flex w-full items-center gap-4 border-b border-[var(--color-border)] p-4 text-left transition-colors hover:bg-[var(--color-surface-hover)] ${
                      selectedUserId === conv.user.id ? "bg-[var(--color-surface-hover)]" : ""
                    }`}
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-lg font-semibold text-white">
                      {conv.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[var(--color-text)]">
                          {conv.user.username}
                        </span>
                        {conv.lastAt && (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {timeAgo(conv.lastAt)}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-sm text-[var(--color-text-muted)]">
                        {conv.lastMessage ?? "No messages yet"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex flex-1 flex-col">
            {selectedUser ? (
              <>
                <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-sm font-semibold text-white">
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-semibold text-[var(--color-text)]">
                        {selectedUser.username}
                      </h2>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {selectedUser.profession || "Member"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {loadingThread ? (
                    <p className="text-sm text-[var(--color-text-muted)]">Loading messages…</p>
                  ) : threadMessages.length === 0 ? (
                    <p className="text-sm text-[var(--color-text-muted)]">
                      No messages yet. Say hello!
                    </p>
                  ) : (
                    threadMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      const isEditing = editingMessageId === msg.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`group relative max-w-[70%] rounded-2xl px-4 py-2 ${
                              isMe
                                ? "bg-[var(--color-primary)] text-white"
                                : "bg-[var(--color-surface-hover)] text-[var(--color-text)]"
                            }`}
                          >
                            {isEditing ? (
                              <div className="min-w-[200px]">
                                <textarea
                                  value={editMessageContent}
                                  onChange={(e) => setEditMessageContent(e.target.value)}
                                  className="w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/70 focus:outline-none"
                                  rows={2}
                                />
                                <div className="mt-2 flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    className="!bg-white !text-[var(--color-primary)]"
                                    onClick={handleSaveEditMessage}
                                    disabled={loadingEdit}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="!text-white/90 hover:!bg-white/20"
                                    onClick={handleCancelEditMessage}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm">{msg.content}</p>
                                <div className="mt-1 flex items-center gap-2">
                                  <p
                                    className={`text-xs ${
                                      isMe ? "text-white/80" : "text-[var(--color-text-muted)]"
                                    }`}
                                  >
                                    {formatTime(msg.createdAt)}
                                  </p>
                                  {isMe && (
                                    <span className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                      <button
                                        type="button"
                                        onClick={() => handleStartEditMessage(msg)}
                                        className="rounded p-0.5 hover:bg-white/20"
                                        title="Edit"
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setPendingDeleteMessage(msg)}
                                        className="rounded p-0.5 hover:bg-white/20"
                                        title="Delete"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

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
                    <Button
                      onClick={handleSend}
                      size="icon"
                      className="h-12 w-12"
                      disabled={sending}
                    >
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

      {pendingDeleteMessage && (
        <ConfirmDeletePopup
          message="Are you sure you want to delete this message? This cannot be undone."
          onCancel={() => setPendingDeleteMessage(null)}
          onConfirm={() => handleDeleteMessage(pendingDeleteMessage)}
          isDeleting={isDeletingMessage}
        />
      )}
    </main>
  );
}
