"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Lightbulb } from "lucide-react";

const CATEGORIES = [
  "Technology",
  "Healthcare",
  "Fintech",
  "E-commerce",
  "Education",
  "Sustainability",
  "Developer Tools",
  "Consumer",
  "B2B",
  "Other",
];

const SKILLS_OPTIONS = [
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "Design",
  "Marketing",
  "Sales",
  "Product Management",
  "Mobile Development",
  "AI/ML",
];

export default function PostIdeaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problemStatement: "",
    proposedSolution: "",
    category: "",
    requiredSkills: [] as string[],
    teamSizeNeeded: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: API call
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    toast.success("Idea published.");
    router.push("/ideas");
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }));
  };

  return (
    <main className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/ideas"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Ideas
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Share Your Startup Idea
          </h1>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Describe your idea and find collaborators who share your vision.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/20">
                  <Lightbulb className="h-6 w-6 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    Basic Information
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Give your idea a compelling title and description
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Idea Title"
                placeholder="e.g., AI-Powered Code Review Platform"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Description
                </label>
                <textarea
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  rows={4}
                  placeholder="Describe your startup idea in detail..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Problem Statement
                </label>
                <textarea
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  rows={3}
                  placeholder="What problem does your idea solve?"
                  value={formData.problemStatement}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      problemStatement: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Proposed Solution
                </label>
                <textarea
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  rows={3}
                  placeholder="How does your idea address the problem?"
                  value={formData.proposedSolution}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      proposedSolution: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Category & Team
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Help others discover your idea
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Industry Category
                </label>
                <select
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Required Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_OPTIONS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        formData.requiredSkills.includes(skill)
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="Team Size Needed"
                type="number"
                placeholder="e.g., 3"
                min={1}
                max={20}
                value={formData.teamSizeNeeded}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    teamSizeNeeded: e.target.value,
                  }))
                }
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg" disabled={isSubmitting} isLoading={isSubmitting}>
              Publish Idea
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
