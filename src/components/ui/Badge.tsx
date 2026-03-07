import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md";
}

function Badge({ className, variant = "default", size = "md", ...props }: BadgeProps) {
  const variants = {
    default:
      "bg-[var(--color-surface-hover)] text-[var(--color-text)]",
    primary:
      "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30",
    secondary:
      "bg-[var(--color-surface-hover)]/80 text-[var(--color-text-muted)]",
    accent:
      "bg-[var(--color-accent)]/20 text-[var(--color-accent-muted)] border border-[var(--color-accent)]/30",
    success:
      "bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/30",
    warning:
      "bg-[var(--color-warning)]/20 text-[var(--color-warning)] border border-[var(--color-warning)]/30",
    error:
      "bg-[var(--color-error)]/20 text-[var(--color-error)] border border-[var(--color-error)]/30",
    outline:
      "border border-[var(--color-border)] text-[var(--color-text-muted)]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
