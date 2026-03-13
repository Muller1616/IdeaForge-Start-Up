"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { resetPassword } from "@/lib/passwordReset";
import { ArrowLeft, Lock } from "lucide-react";
import { InlineNotification } from "@/components/ui/InlineNotification";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    if (!token) setInvalidToken(true);
  }, [token]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("token", token);
    try {
      const result = await resetPassword(formData);
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

  if (!token || invalidToken) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-xl">
        <InlineNotification
          type="error"
          message="Invalid or expired reset link. Please request a new one."
          onDismiss={() => {}}
          autoDismissSeconds={0}
        />
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Request new link
        </Link>
      </div>
    );
  }

  return (
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
          Set new password
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Enter your new password below. Use at least 6 characters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="token" value={token ?? ""} />
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
            htmlFor="password"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]"
          >
            <Lock className="h-4 w-4 text-[var(--color-text-muted)]" />
            New password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            minLength={6}
            disabled={isPending}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-[var(--color-text)]"
          >
            Confirm new password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            minLength={6}
            disabled={isPending}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
            placeholder="Repeat your new password"
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
            "Reset password"
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-xl">
            <div className="h-8 w-32 animate-pulse rounded bg-[var(--color-surface-hover)]" />
            <div className="mt-4 h-4 w-48 animate-pulse rounded bg-[var(--color-surface-hover)]" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
