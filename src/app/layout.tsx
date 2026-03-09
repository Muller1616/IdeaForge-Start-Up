import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/Toaster";

export const metadata: Metadata = {
  title: "IdeaForge - Startup Idea Collaboration Platform",
  description:
    "Share startup ideas, find co-founders, and build the next big thing together. Connect with entrepreneurs, developers, and designers.",
  keywords: ["startup", "ideas", "collaboration", "co-founders", "entrepreneurship"],
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser(); l

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans min-h-screen flex flex-col`}
      >
        <AuthProvider user={user}>
          <Toaster />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
