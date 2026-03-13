"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const defaultClass =
  "inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]";

interface BackButtonProps {
  /** When provided, renders a link (for accessibility); click still runs router.back() first. */
  fallbackHref?: string;
  /** Button/link label */
  children?: React.ReactNode;
  className?: string;
}

export function BackButton({ fallbackHref, children = "Back", className }: BackButtonProps) {
  const router = useRouter();
  const cn = className ?? defaultClass;
  const content = (
    <>
      <ArrowLeft className="h-4 w-4" />
      {children}
    </>
  );

  if (fallbackHref) {
    return (
      <Link
        href={fallbackHref}
        onClick={(e) => {
          e.preventDefault();
          router.back();
        }}
        className={cn}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => router.back()} className={cn}>
      {content}
    </button>
  );
}
