"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  Lightbulb,
  MessageCircle,
  User,
  Shield,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/components/providers/AuthProvider";
import { logout } from "@/lib/auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/ideas", label: "Ideas" },
  { href: "/ideas?filter=trending", label: "Trending" },
  { href: "/ideas?filter=new", label: "New" },
];

const userMenuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ideas/new", label: "Post Idea", icon: Lightbulb },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile/me", label: "My Profile", icon: User },
  { href: "/admin", label: "Admin Panel", icon: Shield },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user } = useAuth();
  
  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white">
            IF
          </span>
          <span className="gradient-text hidden sm:inline">IdeaForge</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth / User section */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoggedIn ? (
            <div className="relative hidden md:block">
              <span className="mr-4 text-sm font-medium text-[var(--color-text)]">
                Welcome, {user?.username}
              </span>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-hover)]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-sm font-bold text-white uppercase">
                  {user?.username?.charAt(0) || 'U'}
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition ${userMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                    aria-hidden
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-2 shadow-xl">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text)] transition hover:bg-[var(--color-surface-hover)]"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4 text-[var(--color-text-muted)]" />
                        {item.label}
                      </Link>
                    ))}
                    <hr className="my-2 border-[var(--color-border)]" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-error)] transition hover:bg-[var(--color-surface-hover)]"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-[var(--shadow-glow)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                {userMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full text-left rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-error)] hover:bg-[var(--color-surface-hover)]"
                  >
                    Log out
                  </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
