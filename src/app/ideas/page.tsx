"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Search, TrendingUp, Sparkles, Clock, ChevronUp, MessageCircle, Users } from "lucide-react";

import { getIdeas } from "@/lib/ideas";

const FILTERS = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "new", label: "New", icon: Clock },
  { id: "popular", label: "Most Popular", icon: ChevronUp },
];

const CATEGORIES = [
  "All", "Health Tech", "Web3", "E-commerce", "SaaS", "Fintech", "EdTech", "Other",
];

export default async function IdeasPage() {
  const ideas = await getIdeas();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
          Discover Startup Ideas
        </h1>
        <p className="mt-2 text-slate-400">
          Explore ideas from entrepreneurs worldwide. Find your next collaboration.
        </p>
      </div>

      {/* Ideas Grid */}
      <div className="space-y-6">
        {ideas.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-surface-elevated)]">
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No ideas matching this search</h3>
            <p className="mb-6">Be the first to post an idea in this space!</p>
            <Link href="/ideas/new">
              <Button>Post New Idea</Button>
            </Link>
          </div>
        ) : (
          ideas.map((idea) => (
            <Link key={idea.id} href={`/ideas/${idea.id}`}>
              <Card className="group overflow-hidden border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition hover:border-[var(--color-primary)]/50 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{idea.status}</Badge>
                      </div>
                      <h2 className="mt-3 text-xl font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition">
                        {idea.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-[var(--color-text-muted)] leading-relaxed">
                        {idea.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1">
                          <ChevronUp className="h-4 w-4" />
                          {idea.upvotes || 0} upvotes
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(idea.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border)]">
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${idea.authorUsername}&backgroundColor=111827&textColor=ffffff`} 
                        alt={idea.authorUsername}
                        className="h-10 w-10 rounded-full border border-[var(--color-border)] object-cover" 
                      />
                      <span className="text-sm font-medium text-[var(--color-text)]">{idea.authorUsername}</span>
                      <Button size="sm" variant="outline" className="hidden sm:inline-flex">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Post Idea CTA */}
      <div className="mt-12 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-8 text-center shadow-lg shadow-[var(--color-primary)]/5">
        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Have a vision for the future?</h3>
        <p className="mt-2 text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Post your startup idea and find developers, designers, and marketers who believe in your mission.
        </p>
        <Link href="/ideas/new">
          <Button className="mt-4">Post Your Idea</Button>
        </Link>
      </div>
    </div>
  );
}
