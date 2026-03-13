"use server";

import fs from "fs/promises";
import path from "path";

export interface JoinRequest {
  id: string;
  ideaId: string;
  userId: string;
  username: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PATH = path.join(DATA_DIR, "join-requests.json");

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(PATH);
  } catch {
    await fs.writeFile(PATH, JSON.stringify({ requests: [] }, null, 2));
  }
}

async function getRequests(): Promise<JoinRequest[]> {
  await ensureFile();
  const data = await fs.readFile(PATH, "utf-8");
  const parsed = JSON.parse(data) as { requests?: JoinRequest[] };
  return Array.isArray(parsed.requests) ? parsed.requests : [];
}

async function saveRequests(requests: JoinRequest[]) {
  await ensureFile();
  await fs.writeFile(PATH, JSON.stringify({ requests }, null, 2));
}

export async function getJoinRequestsByIdeaId(ideaId: string): Promise<JoinRequest[]> {
  const requests = await getRequests();
  return requests
    .filter((r) => r.ideaId === ideaId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Count of join requests approved for this user (teams they joined). */
export async function getApprovedJoinRequestsCount(userId: string): Promise<number> {
  const requests = await getRequests();
  return requests.filter((r) => r.userId === userId && r.status === "approved").length;
}

/** All join requests for a user (to build activity). */
export async function getJoinRequestsByUserId(userId: string): Promise<JoinRequest[]> {
  const requests = await getRequests();
  return requests.filter((r) => r.userId === userId);
}

/** Join requests on any of the given idea IDs (e.g. for idea owner activity feed). */
export async function getJoinRequestsForIdeaIds(ideaIds: string[]): Promise<JoinRequest[]> {
  if (ideaIds.length === 0) return [];
  const set = new Set(ideaIds);
  const requests = await getRequests();
  return requests
    .filter((r) => set.has(r.ideaId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Request by this user for this idea (if any). Used to show status to requester. */
export async function getJoinRequestByIdeaAndUser(
  ideaId: string,
  userId: string
): Promise<JoinRequest | null> {
  const requests = await getRequests();
  const found = requests.find((r) => r.ideaId === ideaId && r.userId === userId);
  return found ?? null;
}

export async function createJoinRequest(
  ideaId: string,
  userId: string,
  username: string
): Promise<JoinRequest | { error: string }> {
  const requests = await getRequests();
  const existing = requests.find(
    (r) => r.ideaId === ideaId && r.userId === userId && r.status === "pending"
  );
  if (existing) return { error: "You already have a pending request for this idea." };
  const req: JoinRequest = {
    id: crypto.randomUUID(),
    ideaId,
    userId,
    username,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  requests.push(req);
  await saveRequests(requests);
  return req;
}

export async function updateJoinRequestStatus(
  requestId: string,
  status: "approved" | "rejected",
  ideaOwnerId: string
): Promise<{ error?: string }> {
  const requests = await getRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return { error: "Request not found." };
  const idea = await (await import("./ideas")).getIdeaById(requests[index].ideaId);
  if (!idea || idea.authorId !== ideaOwnerId) return { error: "Not authorized." };
  requests[index].status = status;
  await saveRequests(requests);
  return {};
}
