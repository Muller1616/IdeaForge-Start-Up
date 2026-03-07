"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Search, TrendingUp, Sparkles, Clock, ChevronUp, MessageCircle, Users } from "lucide-react";

const MOCK_IDEAS = [
  {
    id: "1",
    title: "AI-Powered Recipe Generator for Dietary Restrictions",
    description: "An app that generates personalized recipes based on dietary restrictions, allergies, and nutritional goals using AI.",
    category: "Health Tech",
    upvotes: 342,
    comments: 28,
    teamSize: 3,
    skills: ["AI/ML", "React", "Node.js"],
    createdAt: "2 hours ago",
    author: "Sarah Chen",
    trending: true,
  },
  {
    id: "2",
    title: "Decentralized Freelance Marketplace",
    description: "A blockchain-based platform connecting freelancers with clients, with smart contracts for escrow and dispute resolution.",
    category: "Web3",
    upvotes: 189,
    comments: 45,
    teamSize: 4,
    skills: ["Solidity", "React", "PostgreSQL"],
    createdAt: "5 hours ago",
    author: "Alex Rivera",
    trending: true,
  },
  {
    id: "3",
    title: "Sustainable Fashion Discovery Platform",
    description: "Curated marketplace for eco-friendly fashion brands with carbon footprint tracking and transparency scores.",
    category: "E-commerce",
    upvotes: 156,
    comments: 12,
    teamSize: 2,
    skills: ["Next.js", "Design", "Sustainability"],
    createdAt: "1 day ago",
    author: "Emma Wilson",
    trending: false,
  },
  {
    id: "4",
    title: "Mental Health Check-in Bot for Remote Teams",
    description: "Slack/Teams integration that prompts daily wellness check-ins and provides anonymous aggregated insights to managers.",
    category: "SaaS",
    upvotes: 98,
    comments: 19,
    teamSize: 3,
    skills: ["Python", "Slack API", "Analytics"],
    createdAt: "3 days ago",
    author: "James Park",
    trending: false,
  },
];

const FILTERS = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "new", label: "New", icon: Clock },
  { id: "popular", label: "Most Popular", icon: ChevronUp },
];

const CATEGORIES = [
  "All", "Health Tech", "Web3", "E-commerce", "SaaS", "Fintech", "EdTech", "Other",
];

export default function IdeasPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Discover Startup Ideas
        </h1>
        <p className="mt-2 text-slate-400">
          Explore ideas from entrepreneurs worldwide. Find your next collaboration.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Search ideas by title, description, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-600 bg-slate-800/50 py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeFilter === filter.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <filter.icon className="h-4 w-4" />
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50"
                  : "border border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="space-y-6">
        {MOCK_IDEAS.map((idea) => (
          <Link key={idea.id} href={`/ideas/${idea.id}`}>
            <Card className="group border-slate-700/50 bg-slate-800/30 transition hover:border-indigo-500/30 hover:bg-slate-800/50">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{idea.category}</Badge>
                      {idea.trending && (
                        <Badge variant="accent" className="gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-white group-hover:text-indigo-300 transition">
                      {idea.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-slate-400">
                      {idea.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <ChevronUp className="h-4 w-4" />
                        {idea.upvotes} upvotes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {idea.comments} comments
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Team: {idea.teamSize}
                      </span>
                      <span>{idea.createdAt}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {idea.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-slate-700/50 px-2 py-0.5 text-xs text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <span className="text-xs text-slate-500">by {idea.author}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Post Idea CTA */}
      <div className="mt-12 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-8 text-center">
        <h3 className="text-xl font-semibold text-white">Have an idea to share?</h3>
        <p className="mt-2 text-slate-400">
          Post your startup idea and find collaborators who believe in your vision.
        </p>
        <Link href="/ideas/new">
          <Button className="mt-4">Post Your Idea</Button>
        </Link>
      </div>
    </div>
  );
}
