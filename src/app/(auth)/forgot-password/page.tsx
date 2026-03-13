"use client";

import Link from "next/link";
import { useState } from "react";
import { requestPasswordReset } from "@/lib/passwordReset";
import { ArrowLeft, Mail, User } from "lucide-react";
import { InlineNotification } from "@/components/ui/InlineNotification";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await requestPasswordReset(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      if (err && typeof err === "object" && "digest" in err && (err as { digest?: string }).digest === "NEXT_REDIRECT") throw err;
      setError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-xl">
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-[var(--color-text)]">
            Forgot password
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Enter your username and email. If an account exists, you will be redirected to set a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]"
            >
              <User className="h-4 w-4 text-[var(--color-text-muted)]" />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
              placeholder="Your username"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]"
            >
              <Mail className="h-4 w-4 text-[var(--color-text-muted)]" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
              placeholder="Email linked to your account"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] py-3 font-medium text-white shadow-lg transition hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center"
          >
            {isPending ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Continue to reset password"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
