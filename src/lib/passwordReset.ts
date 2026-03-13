"use server";

import fs from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";
import { getUserByUsername, setUserPassword } from "./db";

const DATA_DIR = path.join(process.cwd(), "data");
const TOKENS_PATH = path.join(DATA_DIR, "reset-tokens.json");
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

interface ResetToken {
  token: string;
  userId: string;
  expiresAt: string;
}

async function ensureTokensFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(TOKENS_PATH);
    } catch {
      await fs.writeFile(TOKENS_PATH, JSON.stringify({ tokens: [] }, null, 2));
    }
  } catch (e) {
    console.error("[passwordReset] ensureTokensFile:", e);
    throw new Error("Could not initialize reset tokens storage.");
  }
}

async function getTokens(): Promise<ResetToken[]> {
  await ensureTokensFile();
  try {
    const data = await fs.readFile(TOKENS_PATH, "utf-8");
    const parsed = JSON.parse(data) as { tokens?: ResetToken[] };
    return Array.isArray(parsed.tokens) ? parsed.tokens : [];
  } catch (e) {
    console.error("[passwordReset] getTokens:", e);
    return [];
  }
}

async function saveTokens(tokens: ResetToken[]): Promise<void> {
  await ensureTokensFile();
  await fs.writeFile(TOKENS_PATH, JSON.stringify({ tokens }, null, 2));
}

export async function requestPasswordReset(formData: FormData): Promise<{ error?: string } | void> {
  try {
    const username = String(formData.get("username") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!username || !email) {
      return { error: "Username and email are required." };
    }

    const user = await getUserByUsername(username);
    const userEmail = (user?.email ?? "").trim().toLowerCase();
    const inputEmail = email.trim().toLowerCase();
    if (!user || userEmail !== inputEmail) {
      return { error: "No account found with that username and email." };
    }

    const token = crypto.randomUUID();
    const tokens = await getTokens();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString();
    tokens.push({ token, userId: user.id, expiresAt });
    await saveTokens(tokens);

    redirect(`/reset-password?token=${encodeURIComponent(token)}`);
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e && String((e as { digest?: string }).digest).startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    console.error("[passwordReset] requestPasswordReset:", e);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function resetPassword(formData: FormData): Promise<{ error?: string } | void> {
  try {
    const token = String(formData.get("token") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!token) {
      return { error: "Invalid or expired reset link." };
    }
    if (!password || password.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }
    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }

    const tokens = await getTokens();
    const now = new Date().toISOString();
    const index = tokens.findIndex(
      (t) => t.token === token && t.expiresAt > now
    );
    if (index === -1) {
      return { error: "Invalid or expired reset link. Please request a new one." };
    }

    const { userId } = tokens[index];
    tokens.splice(index, 1);
    await saveTokens(tokens);

    const updated = await setUserPassword(userId, password);
    if (!updated) {
      return { error: "Failed to update password. Please try again." };
    }

    redirect("/login?reset=1");
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e && String((e as { digest?: string }).digest).startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    console.error("[passwordReset] resetPassword:", e);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function getResetTokenValid(token: string): Promise<boolean> {
  if (!token) return false;
  const tokens = await getTokens();
  const now = new Date().toISOString();
  return tokens.some((t) => t.token === token && t.expiresAt > now);
}
