import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, FileText, Info } from "lucide-react";

const linkBase =
  "text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 rounded";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-sm font-bold text-white">
                IF
              </span>
              <span className="font-bold text-[var(--color-text)]">IdeaForge</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Share startup ideas, find co-founders, and build the next big thing together. Connect, collaborate, and grow.
            </p>
          </div>

          {/* About link */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
              <Info className="h-4 w-4" aria-hidden />
              About
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className={linkBase}>
                  About the platform
                </Link>
              </li>
              <li>
                <Link href="/ideas" className={linkBase}>
                  Browse ideas
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
              <FileText className="h-4 w-4" aria-hidden />
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/terms" className={linkBase}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={linkBase}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
              <Mail className="h-4 w-4" aria-hidden />
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/contact" className={linkBase}>
                  Contact form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom: copyright + optional social */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 sm:flex-row">
          <p className="text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} IdeaForge. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 rounded p-1"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 rounded p-1"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 rounded p-1"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
