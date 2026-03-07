import { redirect } from "next/navigation";

// TODO: Replace with real auth check when backend is ready
const isAdmin = false;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
