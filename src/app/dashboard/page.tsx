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
import { BackButton } from "@/components/ui/BackButton";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getIdeas } from "@/lib/ideas";
import { getApprovedJoinRequestsCount, getJoinRequestsForIdeaIds } from "@/lib/joinRequests";
import { getMessageCountForUser } from "@/lib/messages";
import { getCommentsForIdeaIds } from "@/lib/comments";

function timeAgo(isoDate: string): string {
  const sec = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return new Date(isoDate).toLocaleDateString();
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  let allIdeas: Awaited<ReturnType<typeof getIdeas>> = [];
  let teamsJoinedCount = 0;
  let messageCount = 0;
  let commentsOnMyIdeasResolved: Awaited<ReturnType<typeof getCommentsForIdeaIds>> = [];
  let joinRequestsOnMyIdeasResolved: Awaited<ReturnType<typeof getJoinRequestsForIdeaIds>> = [];

  try {
    allIdeas = await getIdeas();
  } catch (e) {
    console.error("[Dashboard] getIdeas failed", e);
  }

  const myIdeas = Array.isArray(allIdeas) ? allIdeas.filter((i) => i.authorId === user.id) : [];
  const myIdeaIds = myIdeas.map((i) => i.id);
  const ideaTitleById = Object.fromEntries(myIdeas.map((i) => [i.id, i.title]));

  try {
    [teamsJoinedCount, messageCount, commentsOnMyIdeasResolved, joinRequestsOnMyIdeasResolved] =
      await Promise.all([
        getApprovedJoinRequestsCount(user.id),
        getMessageCountForUser(user.id),
        myIdeaIds.length > 0 ? getCommentsForIdeaIds(myIdeaIds) : Promise.resolve([]),
        myIdeaIds.length > 0 ? getJoinRequestsForIdeaIds(myIdeaIds) : Promise.resolve([]),
      ]);
  } catch (e) {
    console.error("[Dashboard] stats failed", e);
  }

  const safeComments = Array.isArray(commentsOnMyIdeasResolved) ? commentsOnMyIdeasResolved : [];
  const safeJoinRequests = Array.isArray(joinRequestsOnMyIdeasResolved) ? joinRequestsOnMyIdeasResolved : [];

  const ideasPostedCount = myIdeas.length;
  const upvotesReceived = myIdeas.reduce((sum, i) => sum + (i.upvotes ?? 0), 0);

  const stats = [
    { label: "Ideas Posted", value: ideasPostedCount, icon: Lightbulb, href: "/ideas" },
    { label: "Teams Joined", value: teamsJoinedCount, icon: Users, href: "/ideas" },
    { label: "Messages", value: messageCount, icon: MessageSquare, href: "/messages" },
    { label: "Upvotes Received", value: upvotesReceived, icon: TrendingUp, href: "/ideas" },
  ];

  const sortedActivity = [
    ...safeComments.map((c) => ({
      text: `${c.authorUsername} commented on your idea "${ideaTitleById[c.ideaId] ?? "your idea"}"`,
      time: timeAgo(c.createdAt),
      at: new Date(c.createdAt).getTime(),
    })),
    ...safeJoinRequests.map((r) => ({
      text: `${r.username} requested to join "${ideaTitleById[r.ideaId] ?? "your team"}"`,
      time: timeAgo(r.createdAt),
      at: new Date(r.createdAt).getTime(),
    })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 10)
    .map(({ text, time }) => ({ text, time }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <BackButton fallbackHref="/">Back</BackButton>
      </div>
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
        {stats.map((stat) => (
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
              {myIdeas.length === 0 ? (
                <div className="text-center py-6 text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl">
                  No ideas posted yet. Create your first one!
                </div>
              ) : (
                myIdeas.slice(0, 3).map((idea) => (
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
              href="/ideas"
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
              {sortedActivity.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">
                  No recent activity. Comments and join requests on your ideas will show here.
                </p>
              ) : (
                sortedActivity.map((activity, i) => (
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
                ))
              )}
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
