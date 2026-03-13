import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata = {
  title: "Terms of Service - IdeaForge",
  description: "IdeaForge Terms of Service.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <BackButton fallbackHref="/">Back</BackButton>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>
      </div>

      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <CardContent className="space-y-8 p-6 sm:p-8">
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">1. Acceptance of Terms</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              By accessing or using IdeaForge (“the Platform”), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">2. Use of the Platform</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              You may use IdeaForge to share startup ideas, connect with other users, comment, message, and request to join teams. You are responsible for your conduct and the content you post. Do not post illegal, harmful, or infringing content, or misuse other users’ data.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">3. Accounts</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              You must provide accurate information when registering. You are responsible for keeping your account secure. We may suspend or terminate accounts that violate these terms.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">4. Intellectual Property</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              You retain ownership of the content you post. By posting, you grant IdeaForge a limited license to display and operate on that content as needed to run the service.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">5. Disclaimer</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              The Platform is provided “as is.” We do not guarantee availability, accuracy, or outcomes. Use at your own risk.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">6. Contact</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              For questions about these terms, please use our{" "}
              <Link href="/contact" className="font-medium text-[var(--color-primary)] hover:underline">
                Contact
              </Link>{" "}
              page.
            </p>
          </section>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
        <Link href="/privacy" className="font-medium text-[var(--color-primary)] hover:underline">
          Privacy Policy
        </Link>
        {" · "}
        <Link href="/" className="font-medium text-[var(--color-primary)] hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}
