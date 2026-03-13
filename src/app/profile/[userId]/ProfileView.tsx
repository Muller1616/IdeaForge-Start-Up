"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import {
  Linkedin,
  Github,
  Lightbulb,
  MessageCircle,
} from "lucide-react";
import type { User } from "@/lib/db";
import type { Idea } from "@/lib/ideas";

interface ProfileViewProps {
  profileUser: User;
  ideas: Idea[];
  isOwnProfile: boolean;
}

export default function ProfileView({ profileUser, ideas, isOwnProfile }: ProfileViewProps) {
  const displayName = profileUser.username;
  const avatarUrl = profileUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileUser.username)}&backgroundColor=111827&textColor=ffffff`;
  const memberSince = new Date(profileUser.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackHref="/ideas">Back</BackButton>
        </div>

        <div className="mb-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            <div className="flex-shrink-0">
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-xl">
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
                  {displayName}
                </h1>
                <p className="mt-1 text-[var(--color-text-muted)]">
                  Member since {memberSince}
                </p>
              </div>

              {profileUser.bio && (
                <p className="max-w-2xl leading-relaxed text-[var(--color-text-muted)]">
                  {profileUser.bio}
                </p>
              )}

              {profileUser.profession && (
                <p className="text-sm text-[var(--color-text-muted)]">
                  {profileUser.profession}
                  {profileUser.location && ` · ${profileUser.location}`}
                </p>
              )}

              {profileUser.skills && profileUser.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profileUser.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              {(profileUser.linkedin || profileUser.github) && (
                <div className="flex flex-wrap gap-4">
                  {profileUser.linkedin && (
                    <a
                      href={profileUser.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {profileUser.github && (
                    <a
                      href={profileUser.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                </div>
              )}

              <div className="flex gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[var(--color-accent)]" />
                  <span className="font-semibold text-[var(--color-text)]">
                    {ideas.length}
                  </span>
                  <span className="text-[var(--color-text-muted)]">Ideas</span>
                </div>
              </div>

              {!isOwnProfile && (
                <Link href="/messages">
                  <Button variant="outline" type="button" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Send Message
                  </Button>
                </Link>
              )}
              {isOwnProfile && (
                <Link href="/profile/me">
                  <Button variant="outline" type="button">
                    Edit my profile
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <section>
          <h2 className="mb-6 text-xl font-semibold text-[var(--color-text)]">
            Posted Ideas
          </h2>
          {ideas.length === 0 ? (
            <p className="text-[var(--color-text-muted)]">
              No ideas posted yet.
            </p>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea) => (
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
                        <Badge variant="outline">{idea.status}</Badge>
                        <span className="text-sm text-[var(--color-text-muted)]">
                          {idea.upvotes ?? 0} upvotes
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
          )}
        </section>
      </div>
    </main>
  );
}
