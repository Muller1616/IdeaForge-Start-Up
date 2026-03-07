"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Health Tech",
  "Fintech",
  "EdTech",
  "AI/ML",
  "E-commerce",
  "SaaS",
  "Social",
  "Sustainability",
  "Food & Nutrition",
  "Other",
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") ?? "All";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.delete("page");
    router.push(`/ideas?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => handleCategoryChange(category)}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition",
            currentCategory === category
              ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25"
              : "bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
