"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getUsers } from "@/lib/db";
import type { User } from "@/lib/db";
import { updateMessage as updateMessageDb, deleteMessage as deleteMessageDb } from "@/lib/messages";

/** Users the current user can message (all except self). Passwords stripped. */
export async function getOtherUsers(): Promise<User[]> {
  const current = await getCurrentUser();
  if (!current) return [];
  const users = await getUsers();
  return users
    .filter((u) => u.id !== current.id)
    .map(({ password: _, ...u }) => u as User);
}

/** Edit own message; verifies sender is current user. */
export async function editMessageAction(
  messageId: string,
  content: string
): Promise<{ message?: { id: string; content: string }; error?: string }> {
  const current = await getCurrentUser();
  if (!current) return { error: "You must be logged in to edit." };
  const result = await updateMessageDb(messageId, current.id, content);
  if ("error" in result) return { error: result.error };
  revalidatePath("/dashboard");
  revalidatePath("/messages");
  return { message: { id: result.id, content: result.content } };
}

/** Delete own message; verifies sender is current user. */
export async function deleteMessageAction(messageId: string): Promise<{ error?: string }> {
  const current = await getCurrentUser();
  if (!current) return { error: "You must be logged in to delete." };
  const result = await deleteMessageDb(messageId, current.id);
  revalidatePath("/dashboard");
  revalidatePath("/messages");
  return result;
}
