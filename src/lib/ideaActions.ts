"use server";

import { cookies } from "next/headers";
import { createIdea } from "./ideas";
import { getUserById } from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitIdea(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return { error: "User must be logged in to post an idea" };
  }

  const user = await getUserById(userId);
  if (!user) {
    return { error: "Invalid user session" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const statusRaw = formData.get("status") as string;
  
  const status = (statusRaw === "active" || statusRaw === "team-forming" || statusRaw === "completed") 
    ? statusRaw 
    : "active";

  if (!title || !description) {
    return { error: "Title and description are required" };
  }

  await createIdea({
    title,
    description,
    authorId: user.id,
    authorUsername: user.username,
    status
  });

  revalidatePath("/dashboard");
  revalidatePath("/ideas");
  
  redirect("/dashboard");
}
