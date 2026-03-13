"use server";

import fs from "fs/promises";
import path from "path";
import { getIdeas, getIdeaById } from "./ideas";

const DATA_DIR = path.join(process.cwd(), "data");
const PATH = path.join(DATA_DIR, "upvotes.json");

interface UpvoteRecord {
  ideaId: string;
  userId: string;
}

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(PATH);
  } catch {
    await fs.writeFile(PATH, JSON.stringify({ upvotes: [] }, null, 2));
  }
}

async function getUpvotes(): Promise<UpvoteRecord[]> {
  await ensureFile();
  const data = await fs.readFile(PATH, "utf-8");
  const parsed = JSON.parse(data) as { upvotes?: UpvoteRecord[] };
  return Array.isArray(parsed.upvotes) ? parsed.upvotes : [];
}

async function saveUpvotes(upvotes: UpvoteRecord[]) {
  await ensureFile();
  await fs.writeFile(PATH, JSON.stringify({ upvotes }, null, 2));
}

export async function hasUserUpvoted(ideaId: string, userId: string): Promise<boolean> {
  const upvotes = await getUpvotes();
  return upvotes.some((u) => u.ideaId === ideaId && u.userId === userId);
}

export async function toggleUpvote(
  ideaId: string,
  userId: string
): Promise<{ upvotes: number; error?: string }> {
  const { updateIdeaUpvotes } = await import("./ideas");
  const upvotes = await getUpvotes();
  const index = upvotes.findIndex((u) => u.ideaId === ideaId && u.userId === userId);
  if (index >= 0) {
    upvotes.splice(index, 1);
    await saveUpvotes(upvotes);
    const newCount = await updateIdeaUpvotes(ideaId, -1);
    return { upvotes: newCount };
  }
  upvotes.push({ ideaId, userId });
  await saveUpvotes(upvotes);
  const newCount = await updateIdeaUpvotes(ideaId, 1);
  return { upvotes: newCount };
}

export async function getUpvoteCount(ideaId: string): Promise<number> {
  const idea = await getIdeaById(ideaId);
  return idea?.upvotes ?? 0;
}
