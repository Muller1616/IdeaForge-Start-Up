import Link from "next/link";
import { ArrowRight, Lightbulb, Users, Rocket, Target, Shield, Zap, Compass } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        {/* Background gradient effects - pointer-events-none so links/buttons remain clickable */}
        <div className="absolute inset-0 bg-[var(--color-surface)] pointer-events-none" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-surface)] to-[var(--color-accent)]/10 pointer-events-none" aria-hidden />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-primary)]/20 rounded-full blur-[120px] opacity-50 pointer-events-none" aria-hidden />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-8 animate-fade-in-up">
            <Zap className="h-4 w-4" />
            <span>The premier platform for startup builders</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Where Great Ideas meet <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
              Exceptional Founders
            </span>
          </h1>
          
          <p className="mt-4 text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            IdeaForge is the ultimate collaboration platform to share your startup concepts, find co-founders, and build the next big thing together.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link
                  href="/dashboard"
                  prefetch={true}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--color-primary)]/30 transition-all hover:scale-105 hover:shadow-[var(--shadow-glow)]"
                >
                  Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/ideas"
                  prefetch={true}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-8 py-4 text-base font-semibold text-[var(--color-text)] transition-all hover:bg-[var(--color-surface-hover)] hover:scale-105"
                >
                  <Compass className="h-5 w-5" />
                  Browse Ideas
                </Link>
                <Link
                  href="/profile/me"
                  prefetch={true}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-8 py-4 text-base font-semibold text-[var(--color-text)] transition-all hover:bg-[var(--color-surface-hover)] hover:scale-105"
                >
                  My Profile
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--color-primary)]/30 transition-all hover:scale-105 hover:shadow-[var(--shadow-glow)]"
                >
                  Sign Up Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-8 py-4 text-base font-semibold text-[var(--color-text)] transition-all hover:bg-[var(--color-surface-hover)] hover:scale-105"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[var(--color-surface-elevated)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Launch</h2>
            <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto">
              From validating your idea to building your dream team, IdeaForge provides the tools you need to succeed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lightbulb className="h-8 w-8 text-[var(--color-warning)]" />,
                title: "Share Ideas",
                description: "Post your startup concepts and get instant validation and constructive feedback from a community of innovators.",
              },
              {
                icon: <Users className="h-8 w-8 text-[var(--color-primary)]" />,
                title: "Find Co-Founders",
                description: "Connect with talented developers, designers, and business experts who share your vision and complementary skills.",
              },
              {
                icon: <Rocket className="h-8 w-8 text-[var(--color-error)]" />,
                title: "Build Together",
                description: "Form dedicated teams, collaborate in real-time workspaces, and execute your vision from zero to one.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 transition-all hover:border-[var(--color-primary)]/50 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-6 inline-block rounded-2xl bg-[var(--color-surface-elevated)] p-4 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About IdeaForge</h2>
              <div className="space-y-6 text-lg text-[var(--color-text-muted)]">
                <p>
                  IdeaForge was built on a simple premise: great startups aren&apos;t built in a vacuum. The hardest part of starting a company isn&apos;t having a good idea, it&apos;s finding the right people to build it with.
                </p>
                <p>
                  We created a dedicated ecosystem where visionary thinkers can collide with skilled builders. Whether you are a solo technical founder looking for a business partner, or an industry expert searching for technical execution, IdeaForge is your launchpad.
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                {[
                  "Verified professional profiles",
                  "Secure direct messaging",
                  "Skill-based matching engine",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-[var(--color-success)]" />
                    <span className="font-medium text-[var(--color-text)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-30 blur-2xl rounded-full" />
              <div className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-[var(--color-border)]">
                  <div>
                    <div className="text-4xl font-bold text-[var(--color-text)] mb-2">10k+</div>
                    <div className="text-[var(--color-text-muted)] font-medium">Active Founders</div>
                  </div>
                  <Target className="h-12 w-12 text-[var(--color-primary)] opacity-50" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-[var(--color-text)] mb-2">500+</div>
                    <div className="text-[var(--color-text-muted)] font-medium">Startups Launched</div>
                  </div>
                  <Rocket className="h-12 w-12 text-[var(--color-accent)] opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] p-12 sm:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" aria-hidden />
            <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white mb-6">
              {user ? "Ready to build?" : "Ready to bring your idea to life?"}
            </h2>
            <p className="relative z-10 text-lg text-white/80 max-w-2xl mx-auto mb-10">
              {user
                ? "Explore ideas, post your own, or find your next co-founder."
                : "Join thousands of entrepreneurs building the future. Your co-founder is waiting for you."}
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <>
                  <Link
                    href="/ideas"
                    className="rounded-xl bg-white text-[var(--color-primary-dark)] px-8 py-4 text-base font-bold shadow-lg transition-transform hover:scale-105"
                  >
                    Browse Ideas
                  </Link>
                  <Link
                    href="/dashboard"
                    className="rounded-xl border-2 border-white/20 bg-black/10 text-white backdrop-blur px-8 py-4 text-base font-bold transition-all hover:bg-black/20 hover:scale-105"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile/me"
                    className="rounded-xl border-2 border-white/20 bg-black/10 text-white backdrop-blur px-8 py-4 text-base font-bold transition-all hover:bg-black/20 hover:scale-105"
                  >
                    My Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="rounded-xl bg-white text-[var(--color-primary-dark)] px-8 py-4 text-base font-bold shadow-lg transition-transform hover:scale-105"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-xl border-2 border-white/20 bg-black/10 text-white backdrop-blur px-8 py-4 text-base font-bold transition-all hover:bg-black/20 hover:scale-105"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
