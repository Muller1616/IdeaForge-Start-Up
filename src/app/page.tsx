import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%236366f1\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Turn Ideas Into{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Reality
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Connect with entrepreneurs, developers, and designers. Share your startup ideas,
              find co-founders, and build the next big thing together.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/ideas"
                className="rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
              >
                Explore Ideas
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-slate-600 bg-slate-800/50 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:border-indigo-500/50 hover:bg-slate-800"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900/50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything You Need to Launch
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              From idea validation to team building—all in one platform.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: "Share Ideas",
                description: "Post your startup concepts and get feedback from a community of innovators.",
                icon: "💡",
              },
              {
                title: "Find Co-Founders",
                description: "Connect with developers, designers, and business experts who share your vision.",
                icon: "🤝",
              },
              {
                title: "Build Together",
                description: "Form teams, collaborate in real-time, and turn ideas into successful startups.",
                icon: "🚀",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8 backdrop-blur transition hover:border-indigo-500/30"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-950 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 px-8 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-bold text-white">
              Ready to bring your idea to life?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Join thousands of entrepreneurs building the future. Create your free account today.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
