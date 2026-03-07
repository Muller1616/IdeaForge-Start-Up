"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUp,
  MessageCircle,
  UserPlus,
  Share2,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";

// Mock data - will be replaced with API
const mockIdea = {
  id: "1",
  title: "AI-Powered Recipe Generator for Dietary Restrictions",
  description:
    "An intelligent app that generates personalized recipes based on dietary restrictions, allergies, and nutritional goals. Uses ML to suggest substitutions and create meal plans.",
  problemStatement:
    "People with dietary restrictions (celiac, diabetes, allergies) struggle to find recipes that meet their needs. Existing apps have limited customization and often require manual filtering.",
  proposedSolution:
    "AI-driven recipe engine that understands ingredient compatibility, suggests alternatives, and generates complete meal plans. Integration with grocery delivery for one-click ordering.",
  author: {
    name: "Sarah Chen",
    avatar: null,
    skills: ["Product", "ML"],
  },
  upvotes: 342,
  comments: 28,
  category: "Health Tech",
  industry: "Food & Nutrition",
  requiredSkills: ["ML/AI", "Mobile Dev", "Nutrition"],
  teamSizeNeeded: 4,
  createdAt: "2025-03-01",
  hasUpvoted: false,
};

const mockComments = [
  {
    id: "1",
    author: "Alex Rivera",
    avatar: null,
    content: "This is brilliant! I've been looking for something like this. Would love to contribute as a mobile developer.",
    createdAt: "2 hours ago",
    replies: [
      {
        id: "1-1",
        author: "Sarah Chen",
        content: "Thanks Alex! Let's connect - I'll send you a message.",
        createdAt: "1 hour ago",
      },
    ],
  },
  {
    id: "2",
    author: "Jordan Kim",
    avatar: null,
    content: "Have you considered integrating with nutritionist APIs for professional validation? Could add credibility.",
    createdAt: "5 hours ago",
    replies: [],
  },
];

export default function IdeaDetailPage() {
  useParams(); // id available as params.id when connecting to API
  const [commentText, setCommentText] = useState("");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/ideas"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
      >
        ← Back to Ideas
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-8">
          <Card className="overflow-hidden p-0">
            <div className="border-b border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 p-8">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{mockIdea.category}</Badge>
                <Badge variant="secondary">{mockIdea.industry}</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
                {mockIdea.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Posted {mockIdea.createdAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  Team of {mockIdea.teamSizeNeeded} needed
                </span>
              </div>
            </div>

            <div className="space-y-8 p-8">
              <section>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Description
                </h2>
                <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
                  {mockIdea.description}
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Problem Statement
                </h2>
                <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
                  {mockIdea.problemStatement}
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Proposed Solution
                </h2>
                <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
                  {mockIdea.proposedSolution}
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Required Skills
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mockIdea.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
              <Button
                variant={mockIdea.hasUpvoted ? "primary" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => toast.success("Upvoted!")}
              >
                <ArrowUp className="h-4 w-4" />
                {mockIdea.upvotes} Upvotes
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                {mockIdea.comments} Comments
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="gap-2"
                onClick={() => toast.success("Join request sent to the idea owner.")}
              >
                <UserPlus className="h-4 w-4" />
                Request to Join
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard.");
                  } catch {
                    toast.error("Could not copy link.");
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </Card>

          {/* Comments section */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              Comments ({mockComments.length})
            </h2>
            <div className="mt-6 space-y-6">
              {mockComments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-[var(--color-border)] pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-sm font-semibold text-white">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--color-text)]">
                          {comment.author}
                        </span>
                        <span className="text-sm text-[var(--color-text-muted)]">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="mt-1 text-[var(--color-text-muted)]">
                        {comment.content}
                      </p>
                      <button
                        type="button"
                        className="mt-2 text-sm font-medium text-[var(--color-primary)] hover:underline"
                      >
                        Reply
                      </button>
                      {comment.replies.length > 0 && (
                        <div className="mt-4 ml-6 space-y-4 border-l-2 border-[var(--color-border)] pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[var(--color-text)]">
                                  {reply.author}
                                </span>
                                <span className="text-sm text-[var(--color-text-muted)]">
                                  {reply.createdAt}
                                </span>
                              </div>
                              <p className="mt-1 text-[var(--color-text-muted)]">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <textarea
                placeholder="Add a comment..."
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                variant="primary"
                size="sm"
                className="mt-3"
                onClick={() => {
                  if (!commentText.trim()) {
                    toast.error("Write a comment first.");
                    return;
                  }
                  setCommentText("");
                  toast.success("Comment posted.");
                }}
              >
                Post Comment
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-[var(--color-text)]">
              Idea Owner
            </h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-xl font-bold text-white">
                {mockIdea.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text)]">
                  {mockIdea.author.name}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {mockIdea.author.skills.map((skill) => (
                    <Badge key={skill} variant="outline" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full" size="sm">
              View Profile
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-[var(--color-text)]">
              Similar Ideas
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                "Meal planning app for busy parents",
                "Allergy-friendly restaurant finder",
                "Nutrition tracking with AI insights",
              ].map((title, i) => (
                <li key={i}>
                  <Link
                    href={`/ideas/${i + 2}`}
                    className="text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
