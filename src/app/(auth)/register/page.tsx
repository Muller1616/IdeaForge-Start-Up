"use client";

import Link from "next/link";
import { useState } from "react";
import { register } from "@/lib/auth";
import { User, Mail, Briefcase, MapPin, AlignLeft, Code, Linkedin, Github, Image as ImageIcon } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    try {
      const result = await register(formData);
      if (result && result.error) {
        setError(result.error);
        setIsPending(false);
      }
    } catch (err) {
      // Handled by redirect in server action
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Create your profile</h1>
          <p className="text-[var(--color-text-muted)]">
            Join IdeaForge with a rich profile to find the best co-founders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-[var(--color-error)]/10 p-4 text-sm text-[var(--color-error)] border border-[var(--color-error)]/20">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--color-text-muted)]" /> Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  placeholder="johndoe"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--color-text-muted)]" /> Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Password *
                </label>
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

              <div>
                <label htmlFor="profession" className="mb-2 block text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[var(--color-text-muted)]" /> Profession *
                </label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  required
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  placeholder="Developer, Designer, Founder..."
                />
              </div>

              <div>
                <label htmlFor="location" className="mb-2 block text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--color-text-muted)]" /> Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div>
                <label htmlFor="bio" className="mb-2 block text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-[var(--color-text-muted)]" /> Bio (Max 300 chars) *
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  required
                  maxLength={300}
                  rows={4}
                  disabled={isPending}
                  className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  placeholder="Tell us about your background and what you're looking to build..."
                />
              </div>

              <div>
                <label htmlFor="skills" className="mb-2 block text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
                  <Code className="w-4 h-4 text-[var(--color-text-muted)]" /> Skills
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  placeholder="React, TypeScript, Marketing (comma separated)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="linkedin" className="mb-2 block text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-[var(--color-text-muted)]" /> LinkedIn
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    disabled={isPending}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50 text-sm"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label htmlFor="github" className="mb-2 block text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
                    <Github className="w-4 h-4 text-[var(--color-text-muted)]" /> GitHub
                  </label>
                  <input
                    type="url"
                    id="github"
                    name="github"
                    disabled={isPending}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50 text-sm"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="avatarUrl" className="mb-2 block text-sm font-medium text-[var(--color-text)] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[var(--color-text-muted)]" /> Profile Picture URL
                </label>
                <input
                  type="url"
                  id="avatarUrl"
                  name="avatarUrl"
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)]">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] py-4 font-medium text-white shadow-lg transition hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-lg flex justify-center items-center text-lg"
            >
              {isPending ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Create Profile & Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
