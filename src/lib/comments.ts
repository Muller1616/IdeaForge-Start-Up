"use server";

import fs from "fs/promises";
import path from "path";

export interface Comment {
  id: string;
  ideaId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  createdAt: string;
  parentId: string | null;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PATH = path.join(DATA_DIR, "comments.json");

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(PATH);
  } catch {
    await fs.writeFile(PATH, JSON.stringify({ comments: [] }, null, 2));
  }
}

async function getComments(): Promise<Comment[]> {
  await ensureFile();
  const data = await fs.readFile(PATH, "utf-8");
  const parsed = JSON.parse(data) as { comments?: Comment[] };
  return Array.isArray(parsed.comments) ? parsed.comments : [];
}

async function saveComments(comments: Comment[]) {
  await ensureFile();
  await fs.writeFile(PATH, JSON.stringify({ comments }, null, 2));
}

export async function getCommentsByIdeaId(ideaId: string): Promise<Comment[]> {
  const comments = await getComments();
  return comments
    .filter((c) => c.ideaId === ideaId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/** Comments on any of the given idea IDs (e.g. for activity feed), newest first. */
export async function getCommentsForIdeaIds(ideaIds: string[]): Promise<Comment[]> {
  if (ideaIds.length === 0) return [];
  const set = new Set(ideaIds);
  const comments = await getComments();
  return comments
    .filter((c) => set.has(c.ideaId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Comment counts per idea ID (single read). */
export async function getCommentCountsByIdeaIds(
  ideaIds: string[]
): Promise<Record<string, number>> {
  if (ideaIds.length === 0) return {};
  const set = new Set(ideaIds);
  const comments = await getComments();
  const counts: Record<string, number> = {};
  for (const id of ideaIds) counts[id] = 0;
  for (const c of comments) if (set.has(c.ideaId)) counts[c.ideaId] = (counts[c.ideaId] ?? 0) + 1;
  return counts;
}

export async function getCommentById(commentId: string): Promise<Comment | null> {
  const comments = await getComments();
  return comments.find((c) => c.id === commentId) ?? null;
}

export async function addComment(
  ideaId: string,
  authorId: string,
  authorUsername: string,
  content: string,
  parentId: string | null = null
): Promise<Comment | { error: string }> {
  const comments = await getComments();
  const newComment: Comment = {
    id: crypto.randomUUID(),
    ideaId,
    authorId,
    authorUsername,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    parentId,
  };
  comments.push(newComment);
  await saveComments(comments);
  return newComment;
}

/** Only the author can update. Returns updated comment or error. */
export async function updateComment(
  commentId: string,
  content: string,
  userId: string
): Promise<Comment | { error: string }> {
  const comments = await getComments();
  const index = comments.findIndex((c) => c.id === commentId);
  if (index === -1) return { error: "Comment not found." };
  if (comments[index].authorId !== userId) return { error: "You can only edit your own comments." };
  const trimmed = content.trim();
  if (!trimmed) return { error: "Comment cannot be empty." };
  comments[index] = { ...comments[index], content: trimmed };
  await saveComments(comments);
  return comments[index];
}

/** Only the author can delete. */
export async function deleteComment(
  commentId: string,
  userId: string
): Promise<{ error?: string }> {
  const comments = await getComments();
  const index = comments.findIndex((c) => c.id === commentId);
  if (index === -1) return { error: "Comment not found." };
  if (comments[index].authorId !== userId) return { error: "You can only delete your own comments." };
  comments.splice(index, 1);
  await saveComments(comments);
  return {};
}
