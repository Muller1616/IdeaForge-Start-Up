import Link from "next/link";
import { ArrowLeft, Search, Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

// Mock data
const ideas = [
  {
    id: "1",
    title: "AI-Powered Code Review Tool",
    author: "Alex Chen",
    category: "Technology",
    upvotes: 156,
    status: "approved",
    createdAt: "2024-03-01",
  },
  {
    id: "2",
    title: "Sustainable Fashion Marketplace",
    author: "Sarah Miller",
    category: "E-commerce",
    upvotes: 89,
    status: "pending",
    createdAt: "2024-03-05",
  },
  {
    id: "3",
    title: "Mental Health Companion App",
    author: "John Doe",
    category: "Health",
    upvotes: 234,
    status: "approved",
    createdAt: "2024-02-28",
  },
];

export default function AdminIdeasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Idea Moderation
          </h1>
          <p className="mt-1 text-[var(--color-text-muted)]">
            Review and manage submitted ideas
          </p>
        </div>
      </div>

      <Card>
        <div className="border-b border-[var(--color-border)] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <Input
                placeholder="Search ideas..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Filter by status</Button>
            </div>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-muted)]">
                    Idea
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-muted)]">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-muted)]">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-muted)]">
                    Upvotes
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-muted)]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-[var(--color-text-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {ideas.map((idea) => (
                  <tr
                    key={idea.id}
                    className="border-b border-[var(--color-border)] transition hover:bg-[var(--color-surface-hover)]/50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/ideas/${idea.id}`}
                        className="font-medium text-[var(--color-primary)] hover:underline"
                      >
                        {idea.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text)]">
                      {idea.author}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{idea.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text)]">
                      {idea.upvotes}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          idea.status === "approved" ? "success" : "warning"
                        }
                      >
                        {idea.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/ideas/${idea.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
