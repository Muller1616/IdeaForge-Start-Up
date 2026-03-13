import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { Card, CardContent } from "@/components/ui/Card";
import { Lightbulb, Users, MessageCircle, TrendingUp } from "lucide-react";

export const metadata = {
  title: "About - IdeaForge",
  description: "Learn about IdeaForge: share startup ideas, find co-founders, and build together.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <BackButton fallbackHref="/">Back</BackButton>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
          About IdeaForge
        </h1>
        <p className="mt-3 text-lg text-[var(--color-text-muted)]">
          Where startup ideas meet the right people.
        </p>
      </div>

      <Card className="mb-8 border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Our Purpose</h2>
          <p className="mt-3 leading-relaxed text-[var(--color-text-muted)]">
            IdeaForge is a collaboration platform for entrepreneurs, developers, and designers. We help you share startup ideas, find co-founders, gather feedback, and build teams—all in one place. Whether you have an early-stage concept or a validated product, IdeaForge connects you with people who want to build the next big thing.
          </p>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-xl font-semibold text-[var(--color-text)]">Features</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <CardContent className="flex gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
              <Lightbulb className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">Post & Discover Ideas</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Share your startup idea with the community. Browse trending and new ideas, and upvote what you believe in.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <CardContent className="flex gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
              <Users className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">Join Teams</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Request to join idea teams. Idea owners can approve or reject requests and build their squad.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <CardContent className="flex gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
              <MessageCircle className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">Comments & Messages</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Discuss ideas with comments and replies. Message other members directly to take the conversation further.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <CardContent className="flex gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
              <TrendingUp className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text)]">Upvotes & Visibility</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                The best ideas rise with community upvotes. Track your dashboard stats and see how your ideas perform.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
        <Link href="/contact" className="font-medium text-[var(--color-primary)] hover:underline">
          Get in touch
        </Link>
        {" · "}
        <Link href="/" className="font-medium text-[var(--color-primary)] hover:underline">
          Back to Home
        </Link>
      </p>
    </div>
  );
}
