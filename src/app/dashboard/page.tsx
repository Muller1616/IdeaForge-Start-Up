"use client";

import Link from "next/link";
import {
  Lightbulb,
  MessageSquare,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getIdeas } from "@/lib/ideas";

const mockStats = [
  { label: "Ideas Posted", value: 3, icon: Lightbulb, href: "/dashboard/ideas" },
  { label: "Teams Joined", value: 2, icon: Users, href: "/dashboard/teams" },
  { label: "Messages", value: 12, icon: MessageSquare, href: "/messages" },
  { label: "Upvotes Received", value: 89, icon: TrendingUp, href: "#" },
];

const mockActivity = [
  { type: "comment", text: "Sarah commented on your idea", time: "1h ago" },
  { type: "join", text: "Alex requested to join your team", time: "3h ago" },
  { type: "upvote", text: "Your idea got 5 new upvotes", time: "5h ago" },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const ideas = await getIdeas();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Welcome section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-[var(--color-primary)]">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium">Welcome back</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text)]">
          {user.username}
        </h1>
        <p className="mt-1 text-[var(--color-text-muted)]">
          Here&apos;s what&apos;s happening with your startup journey
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="group flex items-center gap-4 p-6 transition hover:border-[var(--color-primary)]/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text)]">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {stat.label}
                </p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 text-[var(--color-text-muted)] opacity-0 transition group-hover:opacity-100" />
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* My Ideas */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--color-text)]">
                My Ideas
              </h2>
              <Link href="/ideas/new">
                <Button variant="primary" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Post Idea
                </Button>
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {ideas.length === 0 ? (
                <div className="text-center py-6 text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl">
                  No ideas posted yet. Create your first one!
                </div>
              ) : (
                ideas.slice(0, 3).map((idea) => (
                  <Link
                    key={idea.id}
                    href={`/ideas/${idea.id}`}
                    className="block rounded-xl border border-[var(--color-border)] p-4 transition hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-surface-elevated)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-[var(--color-text)]">
                          {idea.title}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                          Posted by {idea.authorUsername} · {new Date(idea.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          idea.status === "team-forming" ? "primary" : "secondary"
                        }
                      >
                        {idea.status}
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <Link
              href="/dashboard/ideas"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              View all ideas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              Recent Activity
            </h2>
            <div className="mt-6 space-y-4">
              {mockActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-lg p-3 transition hover:bg-[var(--color-surface-elevated)]"
                >
                  <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)] mt-2" />
                  <div>
                    <p className="text-sm text-[var(--color-text)]">
                      {activity.text}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Quick Actions
            </h2>
            <div className="mt-4 space-y-2">
              <Link href="/ideas/new">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="h-4 w-4" />
                  Post New Idea
                </Button>
              </Link>
              <Link href="/ideas">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Explore Ideas
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Open Messages
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
