"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createUser, getUserByUsername, getUserById, User } from "./db";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  // Check if user exists in our DB
  const user = await getUserByUsername(username);
  
  if (!user || user.password !== password) {
    return { error: "Invalid username or password" };
  }

  const cookieStore = await cookies();
  cookieStore.set("session", "true", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  cookieStore.set("userId", user.id, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  // Store username for simple UI lookup if needed, but DB lookup is preferred
  cookieStore.set("username", user.username, { httpOnly: false, secure: process.env.NODE_ENV === "production" });

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const profession = formData.get("profession") as string;
  const bio = formData.get("bio") as string;
  const skillsStr = formData.get("skills") as string;
  const location = formData.get("location") as string;
  const linkedin = formData.get("linkedin") as string;
  const github = formData.get("github") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  if (!username || !email || !password || !profession || !location) {
    return { error: "Please fill out all required fields" };
  }

  if (bio && bio.length > 300) {
    return { error: "Bio must be less than 300 characters" };
  }

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return { error: "Username already exists" };
  }

  const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

  const newUser = await createUser({
    username,
    email,
    password,
    profession,
    bio,
    skills,
    location,
    linkedin,
    github,
    avatarUrl,
  });

  const cookieStore = await cookies();
  cookieStore.set("session", "true", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  cookieStore.set("userId", newUser.id, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  cookieStore.set("username", newUser.username, { httpOnly: false, secure: process.env.NODE_ENV === "production" });

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("userId");
  cookieStore.delete("username");

  redirect("/");
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const userId = cookieStore.get("userId")?.value;

  if (session && userId) {
    const user = await getUserById(userId);
    if (user) {
      // Don't send password to the client
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
  }

  return null;
}
