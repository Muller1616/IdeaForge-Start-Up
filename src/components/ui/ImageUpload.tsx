import { useState } from "react";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { InlineNotification } from "@/components/ui/InlineNotification";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (base64: string) => void;
}

export function ImageUpload({ currentImageUrl, onImageChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <InlineNotification
          type="error"
          message={error}
          onDismiss={() => setError(null)}
          autoDismissSeconds={0}
        />
      )}
      {preview ? (
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-[var(--color-surface-elevated)] bg-[var(--color-surface)] shadow-md">
          <img src={preview} alt="Profile Preview" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-4 border-dashed border-[var(--color-border)] bg-[var(--color-surface-hover)]">
          <ImageIcon className="h-8 w-8 text-[var(--color-text-muted)]" />
        </div>
      )}
      
      <div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-hover)]">
          <UploadCloud className="h-4 w-4" />
          {preview ? "Change Picture" : "Upload Picture"}
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          Recommended: square image, max 2MB (JPG, PNG).
        </p>
      </div>
    </div>
  );
}
