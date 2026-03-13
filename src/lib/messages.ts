"use server";

import fs from "fs/promises";
import path from "path";

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PATH = path.join(DATA_DIR, "messages.json");

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(PATH);
  } catch {
    await fs.writeFile(PATH, JSON.stringify({ messages: [] }, null, 2));
  }
}

async function getMessages(): Promise<Message[]> {
  await ensureFile();
  try {
    const data = await fs.readFile(PATH, "utf-8");
    const parsed = JSON.parse(data) as { messages?: Message[] };
    return Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch {
    return [];
  }
}

async function saveMessages(messages: Message[]) {
  await ensureFile();
  await fs.writeFile(PATH, JSON.stringify({ messages }, null, 2));
}

/** Total messages where user is sender or receiver (conversation count). */
export async function getMessageCountForUser(userId: string): Promise<number> {
  const messages = await getMessages();
  return messages.filter((m) => m.senderId === userId || m.receiverId === userId).length;
}

export async function getMessagesForUser(userId: string): Promise<Message[]> {
  const messages = await getMessages();
  return messages
    .filter((m) => m.senderId === userId || m.receiverId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Messages between two users (for a conversation), oldest first. */
export async function getMessagesBetween(userId1: string, userId2: string): Promise<Message[]> {
  const messages = await getMessages();
  return messages
    .filter(
      (m) =>
        (m.senderId === userId1 && m.receiverId === userId2) ||
        (m.senderId === userId2 && m.receiverId === userId1)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function sendMessage(
  senderId: string,
  receiverId: string,
  content: string
): Promise<Message | { error: string }> {
  const trimmed = content.trim();
  if (!trimmed) return { error: "Message cannot be empty." };
  const messages = await getMessages();
  const msg: Message = {
    id: crypto.randomUUID(),
    senderId,
    receiverId,
    content: trimmed,
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  await saveMessages(messages);
  return msg;
}

/** Only the sender can update. */
export async function updateMessage(
  messageId: string,
  userId: string,
  content: string
): Promise<Message | { error: string }> {
  const messages = await getMessages();
  const index = messages.findIndex((m) => m.id === messageId);
  if (index === -1) return { error: "Message not found." };
  if (messages[index].senderId !== userId) return { error: "You can only edit your own messages." };
  const trimmed = content.trim();
  if (!trimmed) return { error: "Message cannot be empty." };
  messages[index] = { ...messages[index], content: trimmed };
  await saveMessages(messages);
  return messages[index];
}

/** Only the sender can delete. */
export async function deleteMessage(
  messageId: string,
  userId: string
): Promise<{ error?: string }> {
  const messages = await getMessages();
  const index = messages.findIndex((m) => m.id === messageId);
  if (index === -1) return { error: "Message not found." };
  if (messages[index].senderId !== userId) return { error: "You can only delete your own messages." };
  messages.splice(index, 1);
  await saveMessages(messages);
  return {};
}
