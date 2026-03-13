"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { login } from "@/lib/auth";
import { InlineNotification } from "@/components/ui/InlineNotification";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const justRegistered = searchParams.get("registered") === "1";
  const justReset = searchParams.get("reset") === "1";

  useEffect(() => {
    if (justRegistered) setSuccessMessage("Account created. Please sign in below.");
    if (justReset) setSuccessMessage("Password reset. Sign in with your new password.");
  }, [justRegistered, justReset]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    try {
      const result = await login(formData);
      if (result && result.error) {
        setError(result.error);
        setIsPending(false);
      }
    } catch (err) {
      // Handled by redirect in server action
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Welcome back</h1>
          <p className="text-[var(--color-text-muted)]">
            Sign in to your IdeaForge account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {successMessage && (
            <InlineNotification
              type="success"
              message={successMessage}
              onDismiss={() => setSuccessMessage(null)}
              autoDismissSeconds={6}
            />
          )}
          {error && (
            <InlineNotification
              type="error"
              message={error}
              onDismiss={() => setError(null)}
              autoDismissSeconds={0}
            />
          )}

          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-[var(--color-text)]"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--color-text)]"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] py-3 font-medium text-white shadow-lg transition hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-lg flex justify-center items-center"
          >
            {isPending ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
