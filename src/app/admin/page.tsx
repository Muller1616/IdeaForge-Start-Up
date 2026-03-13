import Link from "next/link";
import {
  Users,
  Lightbulb,
  Shield,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { BackButton } from "@/components/ui/BackButton";

const stats = [
  {
    label: "Total Users",
    value: "2,847",
    icon: Users,
    href: "/admin/users",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Ideas Posted",
    value: "1,234",
    icon: Lightbulb,
    href: "/admin/ideas",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    label: "Pending Moderation",
    value: "12",
    icon: AlertTriangle,
    href: "/admin/moderation",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    label: "Active Teams",
    value: "456",
    icon: TrendingUp,
    href: "/admin/teams",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <BackButton fallbackHref="/dashboard">Back</BackButton>
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Manage users, ideas, and platform content
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="h-full transition-all hover:border-[var(--color-primary)]/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-muted)]">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/admin/users"
                className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-4 transition hover:bg-[var(--color-surface-hover)]"
              >
                <Users className="h-5 w-5 text-[var(--color-primary)]" />
                <span>Manage Users</span>
              </Link>
              <Link
                href="/admin/ideas"
                className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-4 transition hover:bg-[var(--color-surface-hover)]"
              >
                <Lightbulb className="h-5 w-5 text-[var(--color-primary)]" />
                <span>Moderate Ideas</span>
              </Link>
              <Link
                href="/admin/moderation"
                className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-4 transition hover:bg-[var(--color-surface-hover)]"
              >
                <Shield className="h-5 w-5 text-[var(--color-primary)]" />
                <span>Content Moderation</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New user registered", time: "2 min ago" },
                { action: "Idea reported for review", time: "15 min ago" },
                { action: "Team formed: TechFlow", time: "1 hour ago" },
                { action: "User banned: spam@example.com", time: "2 hours ago" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm text-[var(--color-text)]">
                    {item.action}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
