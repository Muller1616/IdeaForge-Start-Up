"use server";

import { cookies } from "next/headers";
import { updateUser, User, getUserById } from "./db";
import { revalidatePath } from "next/cache";

export async function editProfile(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return { error: "User is not authenticated" };
  }

  const profession = formData.get("profession") as string;
  const bio = formData.get("bio") as string;
  const skillsStr = formData.get("skills") as string;
  const location = formData.get("location") as string;
  const linkedin = formData.get("linkedin") as string;
  const github = formData.get("github") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  if (bio && bio.length > 300) {
    return { error: "Bio must be less than 300 characters" };
  }

  const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

  const updateData: Partial<User> = {};
  if (profession) updateData.profession = profession;
  if (bio) updateData.bio = bio;
  if (skills.length > 0) updateData.skills = skills;
  if (location) updateData.location = location;
  if (linkedin !== undefined) updateData.linkedin = linkedin;
  if (github !== undefined) updateData.github = github;
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;


  const updatedUser = await updateUser(userId, updateData);

  if (!updatedUser) {
    return { error: "Failed to update profile" };
  }

  // Force Next.js to re-fetch any cached pages depending on this data
  revalidatePath("/profile/me");

  return { success: true };
}
