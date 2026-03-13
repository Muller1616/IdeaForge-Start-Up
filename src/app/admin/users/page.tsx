import Link from "next/link";
import { Search, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { BackButton } from "@/components/ui/BackButton";

// Mock data
const users = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex@example.com",
    role: "entrepreneur",
    joined: "2024-01-15",
    ideasCount: 5,
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah@example.com",
    role: "developer",
    joined: "2024-02-20",
    ideasCount: 2,
    status: "active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "designer",
    joined: "2024-03-01",
    ideasCount: 0,
    status: "banned",
  },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton fallbackHref="/admin">Back</BackButton>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
            User Management
          </h1>
          <p className="mt-1 text-[var(--color-text-muted)]">
            View and manage all platform users
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-muted)]">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-muted)]">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-muted)]">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-muted)]">
                    Ideas
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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[var(--color-border)] transition hover:bg-[var(--color-surface-hover)]/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[var(--color-text)]">
                          {user.name}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                      {user.joined}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text)]">
                      {user.ideasCount}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={user.status === "active" ? "success" : "error"}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
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
