import Link from "next/link";
import { MessageSquare, Globe2, Mic2, ChevronRight, Trophy, Zap, Star } from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Debate",
    description: "Master argument structure, strategy, and competitive debate across three progressive levels.",
    href: "/debate",
    gradient: "from-indigo-500 to-purple-600",
    levels: ["Level 1 — Foundations", "Level 2 — Strategy", "Level 3 — Competition"],
  },
  {
    icon: Globe2,
    title: "Model UN",
    description: "Research your country, write position papers, and lead committee sessions with confidence.",
    href: "/model-un",
    gradient: "from-blue-500 to-cyan-600",
    levels: ["Research & Position Papers", "Committee Speeches", "Negotiations"],
  },
  {
    icon: Mic2,
    title: "Coach",
    description: "Build your delivery, presence, and persuasion skills with personalized feedback on every speech.",
    href: "/coach",
    gradient: "from-amber-500 to-orange-600",
    levels: ["Delivery & Clarity", "Structure & Flow", "Confidence & Presence"],
  },
];

const STATS = [
  { value: "3", label: "Debate Levels", icon: Trophy },
  { value: "4", label: "Model UN Sections", icon: Globe2 },
  { value: "100%", label: "Personalized", icon: Star },
  { value: "24/7", label: "Available", icon: Zap },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="hero-gradient relative flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-1.5">
            <Zap size={12} className="text-[#6366F1]" />
            <span className="text-xs font-semibold text-[#6366F1]">Personalized coaching for every student</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-[#F1F5F9] sm:text-6xl lg:text-7xl">
            Speak up.{" "}
            <span className="text-gradient">Stand out.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#94A3B8] sm:text-xl">
            Your personal coach for debate, Model UN, and public speaking.
            Learn the skills. Practice with feedback. Win the room.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/onboarding"
              className="animate-pulse-glow flex items-center gap-2 rounded-full bg-[#6366F1] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#4F46E5]"
            >
              Get Started — It&apos;s Free
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/debate"
              className="flex items-center gap-2 rounded-full border border-[#1E293B] px-8 py-4 text-base font-medium text-[#94A3B8] transition-colors hover:border-[#6366F1]/50 hover:text-[#F1F5F9]"
            >
              Explore Sections
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#1E293B] bg-[#111827] px-6 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <Icon size={18} className="mb-1 text-[#6366F1]" />
              <p className="text-2xl font-bold text-[#F1F5F9]">{value}</p>
              <p className="text-xs text-[#94A3B8]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-[#F1F5F9]">Three paths. One goal.</h2>
            <p className="text-[#94A3B8]">Choose your focus or train across all three areas.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description, href, gradient, levels }) => (
              <Link
                key={title}
                href={href}
                className="card-hover glass-card group flex flex-col rounded-2xl p-6"
              >
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${gradient}`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#F1F5F9]">{title}</h3>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-[#94A3B8]">{description}</p>
                <div className="mb-5 flex flex-col gap-1.5">
                  {levels.map((level) => (
                    <div key={level} className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-[#6366F1]" />
                      <span className="text-xs text-[#94A3B8]">{level}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-[#6366F1] transition-all group-hover:gap-2">
                  Explore {title} <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#111827] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-[#F1F5F9]">How it works</h2>
            <p className="text-[#94A3B8]">From zero to confident speaker in three steps.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "Set up your profile", desc: "Answer a quick survey. Your coach learns your experience level, goals, and focus areas." },
              { step: "02", title: "Learn the skills", desc: "Work through structured lessons built for your level — from basic arguments to competition strategy." },
              { step: "03", title: "Practice and get feedback", desc: "Write speeches, run research, practice cross-ex. Your coach analyzes everything and shows you exactly how to improve." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-3">
                <span className="text-gradient text-4xl font-bold">{step}</span>
                <h3 className="text-lg font-semibold text-[#F1F5F9]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#94A3B8]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold text-[#F1F5F9]">Ready to find your voice?</h2>
          <p className="mb-8 text-[#94A3B8]">
            Set up your profile in 2 minutes and get a personalized learning plan built around your goals.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#4F46E5]"
          >
            Start for Free <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
