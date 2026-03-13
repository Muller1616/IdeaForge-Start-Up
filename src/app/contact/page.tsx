"use client";

import { useState } from "react";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InlineNotification } from "@/components/ui/InlineNotification";
import { submitContactMessage } from "@/lib/contactActions";
import { Mail, User, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [notification, setNotification] = useState<{ type: "error" | "success" | "warning"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await submitContactMessage(formData);
      if (result && "error" in result) {
        setNotification({ type: "error", message: result.error ?? "Something went wrong." });
        return;
      }
      if (result && "success" in result) {
        setNotification({ type: "success", message: "Your message has been sent. We'll get back to you soon." });
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      setNotification({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <BackButton fallbackHref="/">Back</BackButton>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-3 text-[var(--color-text-muted)]">
          Send a message to the IdeaForge team. We typically respond within 1–2 business days.
        </p>
      </div>

      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <CardContent className="p-6 sm:p-8">
          {notification && (
            <div className="mb-6">
              <InlineNotification
                type={notification.type}
                message={notification.message}
                onDismiss={() => setNotification(null)}
                autoDismissSeconds={notification.type === "success" ? 5 : 0}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
                <User className="h-4 w-4 text-[var(--color-text-muted)]" />
                Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                disabled={isSubmitting}
                placeholder="Your name"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
                <Mail className="h-4 w-4 text-[var(--color-text-muted)]" />
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isSubmitting}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
                <MessageSquare className="h-4 w-4 text-[var(--color-text-muted)]" />
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                minLength={10}
                rows={5}
                disabled={isSubmitting}
                placeholder="Your message..."
                className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-50"
              />
              <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">At least 10 characters.</p>
            </div>
            <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
        <Link href="/about" className="font-medium text-[var(--color-primary)] hover:underline">
          About IdeaForge
        </Link>
        {" · "}
        <Link href="/" className="font-medium text-[var(--color-primary)] hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}
