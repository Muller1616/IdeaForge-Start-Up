"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Linkedin,
  Github,
  Lightbulb,
  Users,
  MessageCircle,
} from "lucide-react";

// Mock user data - will come from API
const mockUser = {
  id: "1",
  name: "Alex Chen",
  email: "alex@example.com",
  bio: "Full-stack developer passionate about building products that matter. 10+ years of experience in startups.",
  skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
  linkedin: "https://linkedin.com/in/alexchen",
  github: "https://github.com/alexchen",
  profileImage: null,
  ideasCount: 12,
  teamsCount: 3,
  joinedAt: "2024-01-15",
};

const mockIdeas = [
  {
    id: "1",
    title: "AI-Powered Code Review Platform",
    upvotes: 89,
    category: "Developer Tools",
  },
  {
    id: "2",
    title: "Sustainable Fashion Marketplace",
    upvotes: 45,
    category: "E-commerce",
  },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-5xl font-bold text-white shadow-xl">
                {mockUser.name.charAt(0)}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
                  {mockUser.name}
                </h1>
                <p className="mt-1 text-[var(--color-text-muted)]">
                  Member since {new Date(mockUser.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>

              <p className="max-w-2xl text-[var(--color-text-muted)] leading-relaxed">
                {mockUser.bio}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {mockUser.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={mockUser.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href={mockUser.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[var(--color-accent)]" />
                  <span className="font-semibold text-[var(--color-text)]">
                    {mockUser.ideasCount}
                  </span>
                  <span className="text-[var(--color-text-muted)]">Ideas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[var(--color-primary)]" />
                  <span className="font-semibold text-[var(--color-text)]">
                    {mockUser.teamsCount}
                  </span>
                  <span className="text-[var(--color-text-muted)]">Teams</span>
                </div>
              </div>

              <Link href="/messages">
                <Button variant="outline" type="button" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Posted Ideas */}
        <section>
          <h2 className="mb-6 text-xl font-semibold text-[var(--color-text)]">
            Posted Ideas
          </h2>
          <div className="space-y-4">
            {mockIdeas.map((idea) => (
              <Card key={idea.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <Link
                      href={`/ideas/${idea.id}`}
                      className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)]"
                    >
                      {idea.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-3">
                      <Badge variant="outline">{idea.category}</Badge>
                      <span className="text-sm text-[var(--color-text-muted)]">
                        {idea.upvotes} upvotes
                      </span>
                    </div>
                  </div>
                  <Link href={`/ideas/${idea.id}`}>
                    <Button variant="ghost" size="sm" type="button">
                      View
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
