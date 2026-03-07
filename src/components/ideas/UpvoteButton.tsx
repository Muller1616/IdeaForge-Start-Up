"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpvoteButtonProps {
  initialCount: number;
  initialUpvoted?: boolean;
  onUpvote?: () => void;
  onRemoveUpvote?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UpvoteButton({
  initialCount,
  initialUpvoted = false,
  onUpvote,
  onRemoveUpvote,
  className,
  size = "md",
}: UpvoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [upvoted, setUpvoted] = useState(initialUpvoted);

  const handleClick = () => {
    if (upvoted) {
      setCount((c) => c - 1);
      setUpvoted(false);
      onRemoveUpvote?.();
    } else {
      setCount((c) => c + 1);
      setUpvoted(true);
      onUpvote?.();
    }
  };

  const sizeClasses = {
    sm: "h-8 px-2.5 gap-1 text-xs",
    md: "h-10 px-4 gap-2 text-sm",
    lg: "h-12 px-5 gap-2.5 text-base",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200",
        "border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]",
        upvoted
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
          : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]",
        sizeClasses[size],
        className
      )}
      aria-pressed={upvoted}
      aria-label={upvoted ? "Remove upvote" : "Upvote"}
    >
      <ArrowUp
        className={cn(
          "transition-transform",
          upvoted && "rotate-180",
          size === "sm" && "h-3.5 w-3.5",
          size === "md" && "h-4 w-4",
          size === "lg" && "h-5 w-5"
        )}
      />
      {count}
    </button>
  );
}
