"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Users, Calendar, MessageSquare } from "lucide-react";

// Mock team data
const mockTeam = {
  id: "1",
  name: "CodeReview AI",
  ideaId: "1",
  ideaTitle: "AI-Powered Code Review Platform",
  status: "active",
  createdAt: "2024-02-01",
  members: [
    { id: "1", name: "Alex Chen", role: "Founder", skills: ["React", "Node.js"] },
    { id: "2", name: "Sarah Kim", role: "Designer", skills: ["UI/UX", "Figma"] },
    { id: "3", name: "Mike Johnson", role: "Developer", skills: ["Python", "AI/ML"] },
  ],
  updates: [
    {
      id: "1",
      author: "Alex Chen",
      content: "Completed MVP design. Ready for development sprint.",
      date: "2024-03-01",
    },
    {
      id: "2",
      author: "Sarah Kim",
      content: "Finalized UI mockups. Sharing with team for feedback.",
      date: "2024-02-28",
    },
  ],
};

export default function TeamPage() {
  useParams(); // teamId available as params.teamId when connecting to API

  return (
    <main className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Team Header */}
        <div className="mb-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
                {mockTeam.name}
              </h1>
              <Link
                href={`/ideas/${mockTeam.ideaId}`}
                className="mt-2 inline-block text-[var(--color-primary)] hover:underline"
              >
                {mockTeam.ideaTitle}
              </Link>
              <div className="mt-4 flex items-center gap-4">
                <Badge variant="default">{mockTeam.status}</Badge>
                <span className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                  <Calendar className="h-4 w-4" />
                  Formed {new Date(mockTeam.createdAt).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
            <Link
              href="/messages"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-border)] bg-transparent px-6 py-2.5 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-hover)]"
            >
              <MessageSquare className="h-4 w-4" />
              Team Chat
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Team Members */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[var(--color-primary)]" />
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    Team Members
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTeam.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-xl border border-[var(--color-border)] p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-lg font-semibold text-white">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <Link
                            href={`/profile/${member.id}`}
                            className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)]"
                          >
                            {member.name}
                          </Link>
                          <p className="text-sm text-[var(--color-text-muted)]">
                            {member.role}
                          </p>
                          <div className="mt-1 flex gap-1">
                            {member.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/messages"
                        className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                      >
                        Message
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Updates */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Progress Updates
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTeam.updates.map((update) => (
                    <div
                      key={update.id}
                      className="rounded-lg border border-[var(--color-border)] p-4"
                    >
                      <p className="text-sm text-[var(--color-text)]">
                        {update.content}
                      </p>
                      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                        {update.author} • {new Date(update.date).toLocaleDateString("en-US")}
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
