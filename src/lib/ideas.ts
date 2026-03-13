"use server";

import fs from 'fs/promises';
import path from 'path';

export interface Idea {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorUsername: string;
  upvotes: number;
  status: "active" | "team-forming" | "completed";
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), 'data', 'ideas.json');
const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify({ ideas: [] }, null, 2));
  }
}

export async function getIdeas(): Promise<Idea[]> {
  try {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(data) as { ideas?: Idea[] };
    return Array.isArray(parsed.ideas) ? parsed.ideas : [];
  } catch {
    return [];
  }
}

export async function getIdeaById(id: string): Promise<Idea | null> {
  const ideas = await getIdeas();
  return ideas.find((i) => i.id === id) ?? null;
}

export async function createIdea(ideaData: Omit<Idea, 'id' | 'createdAt' | 'upvotes'>): Promise<Idea> {
  const ideas = await getIdeas();
  
  const newIdea: Idea = {
    ...ideaData,
    id: crypto.randomUUID(),
    upvotes: 0,
    createdAt: new Date().toISOString()
  };
  
  ideas.unshift(newIdea); // Add to beginning (newest first)
  await fs.writeFile(DB_PATH, JSON.stringify({ ideas }, null, 2));

  return newIdea;
}

/** Increment or decrement upvote count; returns new count. */
export async function updateIdeaUpvotes(ideaId: string, delta: number): Promise<number> {
  const ideas = await getIdeas();
  const index = ideas.findIndex((i) => i.id === ideaId);
  if (index === -1) return 0;
  ideas[index].upvotes = Math.max(0, (ideas[index].upvotes ?? 0) + delta);
  await fs.writeFile(DB_PATH, JSON.stringify({ ideas }, null, 2));
  return ideas[index].upvotes;
}
