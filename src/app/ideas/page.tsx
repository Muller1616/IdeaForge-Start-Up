import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { BackButton } from "@/components/ui/BackButton";
import { Clock, ChevronUp, Flame, Sparkles, Compass, MessageCircle } from "lucide-react";
import { getIdeas } from "@/lib/ideas";
import type { Idea } from "@/lib/ideas";
import { getCommentCountsByIdeaIds } from "@/lib/comments";
import { getUsers } from "@/lib/db";

type FilterMode = "all" | "trending" | "new";

function sortAndFilterIdeas(ideas: Idea[], filter: FilterMode): Idea[] {
  const copy = [...ideas];
  if (filter === "trending") {
    return copy.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
  }
  if (filter === "new") {
    return copy.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return copy.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function getContext(filter: FilterMode) {
  switch (filter) {
    case "trending":
      return {
        title: "Trending Ideas",
        description: "Most upvoted ideas from the community. See what's hot right now.",
        badgeLabel: "Trending",
        badgeIcon: Flame,
        emptyHeading: "No trending ideas yet",
        emptyBody: "When ideas get upvotes, they'll show up here. Post an idea and get the community voting!",
        ctaHeading: "Want your idea to trend?",
        ctaBody: "Share your startup idea and get the community to vote. The best ideas rise to the top.",
      };
    case "new":
      return {
        title: "New Ideas",
        description: "Recently posted ideas. Be among the first to discover and collaborate.",
        badgeLabel: "New",
        badgeIcon: Sparkles,
        emptyHeading: "No recent ideas",
        emptyBody: "No one has posted lately. Share your idea now and be first in the feed.",
        ctaHeading: "Just thought of something?",
        ctaBody: "Post your idea now and get it in front of early adopters and potential co-founders.",
      };
    default:
      return {
        title: "Discover Startup Ideas",
        description: "Explore ideas from entrepreneurs worldwide. Find your next collaboration.",
        badgeLabel: "All",
        badgeIcon: Compass,
        emptyHeading: "No ideas yet",
        emptyBody: "Be the first to post an idea in this space and start building your network.",
        ctaHeading: "Have a vision for the future?",
        ctaBody: "Post your startup idea and find developers, designers, and marketers who believe in your mission.",
      };
  }
}

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filterParam = typeof params.filter === "string" ? params.filter : undefined;
  const filter: FilterMode =
    filterParam === "trending" ? "trending" : filterParam === "new" ? "new" : "all";

  let rawIdeas: Idea[] = [];
  try {
    rawIdeas = await getIdeas();
  } catch (e) {
    console.error("[IdeasPage] getIdeas failed", e);
  }
  const ideas = sortAndFilterIdeas(Array.isArray(rawIdeas) ? rawIdeas : [], filter);
  let commentCounts: Awaited<ReturnType<typeof getCommentCountsByIdeaIds>> = {};
  let users: Awaited<ReturnType<typeof getUsers>> = [];
  try {
    [commentCounts, users] = await Promise.all([
      getCommentCountsByIdeaIds(ideas.map((i) => i.id)),
      getUsers(),
    ]);
  } catch (e) {
    console.error("[IdeasPage] stats failed", e);
  }
  const safeCommentCounts =
    commentCounts && typeof commentCounts === "object" && !Array.isArray(commentCounts)
      ? commentCounts
      : {};
  const safeUsers = Array.isArray(users) ? users : [];
  const authorIds = [...new Set(ideas.map((i) => i.authorId))];
  const authorAvatarUrls: Record<string, string | null> = {};
  for (const id of authorIds) {
    const user = safeUsers.find((u) => u.id === id);
    const url = user?.avatarUrl?.trim() || null;
    authorAvatarUrls[id] = url || null;
  }
  const ctx = getContext(filter);
  const BadgeIcon = ctx.badgeIcon;

  const tabBase =
    "rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200";
  const tabActive =
    "bg-[var(--color-primary)] text-white shadow-md";
  const tabInactive =
    "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] hover:shadow-sm";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <BackButton fallbackHref="/">Back</BackButton>
      </div>

      {/* Filter tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/ideas"
          className={`${tabBase} ${filter === "all" ? tabActive : tabInactive}`}
        >
          All Ideas
        </Link>
        <Link
          href="/ideas?filter=trending"
          className={`${tabBase} ${filter === "trending" ? tabActive : tabInactive}`}
        >
          Trending
        </Link>
        <Link
          href="/ideas?filter=new"
          className={`${tabBase} ${filter === "new" ? tabActive : tabInactive}`}
        >
          New
        </Link>
      </div>

      {/* Header - context-specific */}
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-primary)]">
          <BadgeIcon className="h-4 w-4" />
          {ctx.badgeLabel}
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
          {ctx.title}
        </h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {ctx.description}
        </p>
      </div>

      {/* Ideas list: spacing, hierarchy, responsive */}
      <div className="space-y-5 sm:space-y-6">
        {ideas.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
              <BadgeIcon className="h-7 w-7 text-[var(--color-primary)]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[var(--color-text)]">
              {ctx.emptyHeading}
            </h3>
            <p className="mx-auto mb-8 max-w-md text-[var(--color-text-muted)]">
              {ctx.emptyBody}
            </p>
            <Link href="/ideas/new">
              <Button>Post New Idea</Button>
            </Link>
          </div>
        ) : (
          ideas.map((idea) => {
            const commentCount = safeCommentCounts[idea.id] ?? 0;
            const upvotes = idea.upvotes ?? 0;
            return (
              <Link key={idea.id} href={`/ideas/${idea.id}`} className="block">
                <Card className="group overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-md sm:hover:shadow-lg">
                  <CardContent className="p-5 sm:p-6 md:p-7">
                    <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-start md:justify-between">
                      {/* Main content */}
                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">{idea.status}</Badge>
                          {filter === "trending" && upvotes > 0 && (
                            <Badge variant="primary" className="gap-1">
                              <Flame className="h-3 w-3" />
                              {upvotes} upvotes
                            </Badge>
                          )}
                          {filter === "new" && (
                            <Badge variant="accent" className="gap-1">
                              <Sparkles className="h-3 w-3" />
                              New
                            </Badge>
                          )}
                        </div>
                        <h2 className="text-lg font-semibold leading-snug text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)] sm:text-xl">
                          {idea.title}
                        </h2>
                        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
                          {idea.description}
                        </p>
                        {/* Meta: upvotes, comments, date */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-text-muted)]">
                          <span className="inline-flex items-center gap-1.5 font-medium text-[var(--color-text)]">
                            <ChevronUp className="h-4 w-4 text-[var(--color-primary)]" aria-hidden />
                            {upvotes} upvotes
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MessageCircle className="h-4 w-4" aria-hidden />
                            {commentCount} {commentCount === 1 ? "comment" : "comments"}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4" aria-hidden />
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {/* Author + CTA */}
                      <div className="flex shrink-0 flex-row items-center gap-4 border-t border-[var(--color-border)] pt-5 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 md:gap-5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)]">
                            {authorAvatarUrls[idea.authorId] ? (
                              <img
                                src={authorAvatarUrls[idea.authorId]!}
                                alt=""
                                width={44}
                                height={44}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Image
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(idea.authorUsername)}&backgroundColor=111827&textColor=ffffff`}
                                alt=""
                                width={44}
                                height={44}
                                className="object-cover"
                              />
                            )}
                          </div>
                          <span className="text-sm font-medium text-[var(--color-text)]">
                            {idea.authorUsername}
                          </span>
                        </div>
                        <span className="inline-flex h-10 items-center justify-center rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-text)] transition-colors group-hover:border-[var(--color-primary)]/50 group-hover:bg-[var(--color-primary)]/5 group-hover:text-[var(--color-primary)]">
                          View Details
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>

      {/* Post Idea CTA - context-specific */}
      <div className="mt-14 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-8 text-center shadow-lg shadow-[var(--color-primary)]/5">
        <h3 className="mb-2 text-xl font-semibold text-[var(--color-text)]">
          {ctx.ctaHeading}
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-[var(--color-text-muted)]">
          {ctx.ctaBody}
        </p>
        <Link href="/ideas/new" className="inline-block mt-5">
          <Button className="transition-opacity hover:opacity-90">Post Your Idea</Button>
        </Link>
      </div>
    </div>
  );
}
