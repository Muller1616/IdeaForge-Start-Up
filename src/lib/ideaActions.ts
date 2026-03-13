"use server";

import { cookies } from "next/headers";
import { createIdea } from "./ideas";
import { getUserById } from "./db";
import { revalidatePath } from "next/cache";
import { addComment as addCommentDb, updateComment as updateCommentDb, deleteComment as deleteCommentDb, type Comment } from "./comments";
import { toggleUpvote, hasUserUpvoted } from "./upvotes";
import { createJoinRequest, updateJoinRequestStatus } from "./joinRequests";

export async function submitIdea(formData: FormData): Promise<{ error?: string } | { success: true }> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return { error: "You must be logged in to post an idea." };
    }

    const user = await getUserById(userId);
    if (!user) {
      return { error: "Invalid session. Please log in again." };
    }

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const statusRaw = formData.get("status") as string | null;
    const status =
      statusRaw === "active" || statusRaw === "team-forming" || statusRaw === "completed"
        ? statusRaw
        : "active";

    if (!title || !description) {
      return { error: "Title and description are required." };
    }

    await createIdea({
      title,
      description,
      authorId: user.id,
      authorUsername: user.username,
      status,
    });

    revalidatePath("/dashboard");
    revalidatePath("/ideas");
    revalidatePath("/");

    return { success: true };
  } catch (e) {
    console.error("[submitIdea]", e);
    return { error: "Failed to save your idea. Please try again." };
  }
}

async function getCurrentUserId(): Promise<{ userId: string; username: string } | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;
  const user = await getUserById(userId);
  return user ? { userId: user.id, username: user.username } : null;
}

export async function upvoteIdea(ideaId: string): Promise<{ upvotes?: number; error?: string }> {
  const auth = await getCurrentUserId();
  if (!auth) return { error: "You must be logged in to upvote." };
  try {
    const result = await toggleUpvote(ideaId, auth.userId);
    revalidatePath(`/ideas/${ideaId}`);
    revalidatePath("/ideas");
    return { upvotes: result.upvotes };
  } catch (e) {
    console.error("[upvoteIdea]", e);
    return { error: "Failed to update vote." };
  }
}

export async function postComment(ideaId: string, content: string): Promise<{ comment?: Comment; error?: string }> {
  const auth = await getCurrentUserId();
  if (!auth) return { error: "You must be logged in to comment." };
  const trimmed = content.trim();
  if (!trimmed) return { error: "Comment cannot be empty." };
  try {
    const comment = await addCommentDb(ideaId, auth.userId, auth.username, trimmed, null);
    if ("error" in comment) return { error: comment.error };
    revalidatePath(`/ideas/${ideaId}`);
    return { comment };
  } catch (e) {
    console.error("[postComment]", e);
    return { error: "Failed to post comment." };
  }
}

export async function postReply(ideaId: string, parentId: string, content: string): Promise<{ comment?: Comment; error?: string }> {
  const auth = await getCurrentUserId();
  if (!auth) return { error: "You must be logged in to reply." };
  const trimmed = content.trim();
  if (!trimmed) return { error: "Reply cannot be empty." };
  try {
    const comment = await addCommentDb(ideaId, auth.userId, auth.username, trimmed, parentId);
    if ("error" in comment) return { error: comment.error };
    revalidatePath(`/ideas/${ideaId}`);
    return { comment };
  } catch (e) {
    console.error("[postReply]", e);
    return { error: "Failed to post reply." };
  }
}

export async function editComment(commentId: string, content: string): Promise<{ comment?: Comment; error?: string }> {
  const auth = await getCurrentUserId();
  if (!auth) return { error: "You must be logged in to edit." };
  try {
    const comment = await updateCommentDb(commentId, content.trim(), auth.userId);
    if ("error" in comment) return { error: comment.error };
    revalidatePath("/ideas");
    revalidatePath(`/ideas/${comment.ideaId}`);
    return { comment };
  } catch (e) {
    console.error("[editComment]", e);
    return { error: "Failed to update comment." };
  }
}

export async function deleteCommentAction(commentId: string): Promise<{ ideaId?: string; error?: string }> {
  const auth = await getCurrentUserId();
  if (!auth) return { error: "You must be logged in to delete." };
  const comment = await (await import("./comments")).getCommentById(commentId);
  if (!comment) return { error: "Comment not found." };
  try {
    const result = await deleteCommentDb(commentId, auth.userId);
    if (result.error) return { error: result.error };
    revalidatePath("/ideas");
    revalidatePath(`/ideas/${comment.ideaId}`);
    return { ideaId: comment.ideaId };
  } catch (e) {
    console.error("[deleteCommentAction]", e);
    return { error: "Failed to delete comment." };
  }
}

export async function requestToJoinIdea(ideaId: string): Promise<{ error?: string }> {
  const auth = await getCurrentUserId();
  if (!auth) return { error: "You must be logged in to request to join." };
  try {
    const result = await createJoinRequest(ideaId, auth.userId, auth.username);
    if ("error" in result) return { error: result.error };
    revalidatePath(`/ideas/${ideaId}`);
    return {};
  } catch (e) {
    console.error("[requestToJoinIdea]", e);
    return { error: "Failed to send request." };
  }
}

export async function approveJoinRequest(requestId: string, ideaId: string): Promise<{ error?: string }> {
  const auth = await getCurrentUserId();
  if (!auth) return { error: "Not logged in." };
  const idea = await (await import("./ideas")).getIdeaById(ideaId);
  if (!idea || idea.authorId !== auth.userId) return { error: "Only the idea owner can approve requests." };
  try {
    const result = await updateJoinRequestStatus(requestId, "approved", auth.userId);
    revalidatePath(`/ideas/${ideaId}`);
    return result;
  } catch (e) {
    console.error("[approveJoinRequest]", e);
    return { error: "Failed to approve." };
  }
}

export async function rejectJoinRequest(requestId: string, ideaId: string): Promise<{ error?: string }> {
  const auth = await getCurrentUserId();
  if (!auth) return { error: "Not logged in." };
  const idea = await (await import("./ideas")).getIdeaById(ideaId);
  if (!idea || idea.authorId !== auth.userId) return { error: "Only the idea owner can reject requests." };
  try {
    const result = await updateJoinRequestStatus(requestId, "rejected", auth.userId);
    revalidatePath(`/ideas/${ideaId}`);
    return result;
  } catch (e) {
    console.error("[rejectJoinRequest]", e);
    return { error: "Failed to reject." };
  }
}

export { hasUserUpvoted };
