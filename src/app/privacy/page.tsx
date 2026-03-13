import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata = {
  title: "Privacy Policy - IdeaForge",
  description: "IdeaForge Privacy Policy: how we use and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <BackButton fallbackHref="/">Back</BackButton>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>
      </div>

      <Card className="border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <CardContent className="space-y-8 p-6 sm:p-8">
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">1. Information We Collect</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              We collect information you provide when you register (e.g. username, email, password, profile details) and when you use the platform (e.g. ideas, comments, messages, join requests). We also collect basic technical data such as session information to run the service.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">2. How We Use Your Data</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              Your data is used to operate IdeaForge: to display your profile, ideas, and activity; to enable messaging and join requests; to authenticate you; and to improve the service. We do not sell your personal information to third parties.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">3. Data Storage and Security</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              Data is stored on our servers. We use reasonable measures to protect your information. Passwords are stored in a way that allows verification only; we do not store plain-text passwords. You are responsible for keeping your login details secure.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">4. Sharing and Visibility</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              Your profile and ideas may be visible to other logged-in users. Comments and messages are visible to the relevant participants. We do not share your data with advertisers or other third parties for marketing.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">5. Your Rights</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              You can update your profile and delete or edit your content where the product allows. You may request access to or deletion of your data by contacting us through the Contact page.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">6. Contact</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
              For privacy-related questions, use our{" "}
              <Link href="/contact" className="font-medium text-[var(--color-primary)] hover:underline">
                Contact
              </Link>{" "}
              page.
            </p>
          </section>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
        <Link href="/terms" className="font-medium text-[var(--color-primary)] hover:underline">
          Terms of Service
        </Link>
        {" · "}
        <Link href="/" className="font-medium text-[var(--color-primary)] hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}
