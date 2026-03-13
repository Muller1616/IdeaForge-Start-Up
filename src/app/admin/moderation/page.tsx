import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BackButton } from "@/components/ui/BackButton";

// Mock reported content
const reportedItems = [
  {
    id: "1",
    type: "idea",
    title: "Suspicious Investment Scheme",
    reporter: "user@example.com",
    reason: "Spam / Fraud",
    status: "pending",
  },
  {
    id: "2",
    type: "comment",
    content: "Inappropriate content...",
    reporter: "mod@example.com",
    reason: "Harassment",
    status: "pending",
  },
];

export default function AdminModerationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton fallbackHref="/admin">Back</BackButton>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Content Moderation
          </h1>
          <p className="mt-1 text-[var(--color-text-muted)]">
            Review reported content and take action
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {reportedItems.map((item) => (
          <Card key={item.id} className="border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)]">
                      {item.type === "idea" ? item.title : "Comment"}
                    </h3>
                    {item.type === "comment" && (
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {item.content}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="warning">{item.reason}</Badge>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        Reported by {item.reporter}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Dismiss
                  </Button>
                  <Button variant="danger" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
