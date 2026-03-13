"use client";

import { useEffect } from "react";
import { X, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

export type InlineNotificationType = "error" | "success" | "warning";

const styles: Record<
  InlineNotificationType,
  { container: string; icon: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  error: {
    container:
      "border-[var(--color-error)]/30 bg-[var(--color-error)]/10 text-[var(--color-error)]",
    icon: "text-[var(--color-error)]",
    Icon: AlertCircle,
  },
  success: {
    container:
      "border-[var(--color-success)]/30 bg-[var(--color-success)]/10 text-[var(--color-success)]",
    icon: "text-[var(--color-success)]",
    Icon: CheckCircle,
  },
  warning: {
    container:
      "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: "text-amber-600 dark:text-amber-400",
    Icon: AlertTriangle,
  },
};

interface InlineNotificationProps {
  type: InlineNotificationType;
  message: string;
  onDismiss: () => void;
  /** Auto-dismiss after this many seconds. 0 or undefined = no auto-dismiss. */
  autoDismissSeconds?: number;
  className?: string;
}

export function InlineNotification({
  type,
  message,
  onDismiss,
  autoDismissSeconds = 5,
  className = "",
}: InlineNotificationProps) {
  const { container, Icon } = styles[type];

  useEffect(() => {
    if (autoDismissSeconds <= 0) return;
    const t = setTimeout(onDismiss, autoDismissSeconds * 1000);
    return () => clearTimeout(t);
  }, [autoDismissSeconds, onDismiss]);

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border p-4 text-sm ${container} ${className}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <p className="min-w-0 flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded p-1 transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
