"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConfirmDeletePopupProps {
  /** e.g. "Are you sure you want to delete this comment?" */
  message: string;
  /** Called when user clicks Cancel or backdrop */
  onCancel: () => void;
  /** Called when user confirms delete. Popup closes after this. */
  onConfirm: () => void | Promise<void>;
  /** While true, Delete button shows loading and is disabled */
  isDeleting?: boolean;
}

export function ConfirmDeletePopup({
  message,
  onCancel,
  onConfirm,
  isDeleting = false,
}: ConfirmDeletePopupProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
        aria-label="Close"
      />

      {/* Popup */}
      <div className="relative w-full max-w-md rounded-2xl border-2 border-red-500/50 bg-[var(--color-surface-elevated)] p-6 shadow-xl">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="confirm-delete-title"
              className="text-lg font-semibold text-[var(--color-text)]"
            >
              Delete?
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {message}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                onClick={handleConfirm}
                disabled={isDeleting}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
