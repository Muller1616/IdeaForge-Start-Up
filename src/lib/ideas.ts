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

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify({ ideas: [] }, null, 2));
  }
}

export async function getIdeas(): Promise<Idea[]> {
  await ensureDb();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data).ideas || [];
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
