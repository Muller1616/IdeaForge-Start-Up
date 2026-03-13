"use server";

import fs from "fs/promises";
import path from "path";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PATH = path.join(DATA_DIR, "contact-messages.json");

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(PATH);
  } catch {
    await fs.writeFile(PATH, JSON.stringify({ messages: [] }, null, 2));
  }
}

async function getMessages(): Promise<ContactMessage[]> {
  await ensureFile();
  try {
    const data = await fs.readFile(PATH, "utf-8");
    const parsed = JSON.parse(data) as { messages?: ContactMessage[] };
    return Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch {
    return [];
  }
}

export async function submitContactMessage(formData: FormData): Promise<{ error?: string } | { success: true }> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || name.length < 2) {
    return { error: "Name is required and must be at least 2 characters." };
  }
  if (!email) {
    return { error: "Email is required." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!message || message.length < 10) {
    return { error: "Message is required and must be at least 10 characters." };
  }

  try {
    const messages = await getMessages();
    const newMessage: ContactMessage = {
      id: crypto.randomUUID(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMessage);
    await ensureFile();
    await fs.writeFile(PATH, JSON.stringify({ messages }, null, 2));
    return { success: true };
  } catch (e) {
    console.error("[submitContactMessage]", e);
    return { error: "Failed to send your message. Please try again." };
  }
}
