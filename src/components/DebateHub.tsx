"use client";

import Link from "next/link";
import { clsx } from "clsx";
import {
  MessageSquare,
  ChevronRight,
  Lock,
  CheckCircle2,
  BookOpen,
  Swords,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

const LEVELS = [
  {
    id: "level-1",
    number: 1,
    title: "Foundations",
    subtitle: "Learn how debate works from the ground up",
    href: "/debate/level-1",
    icon: BookOpen,
    color: "from-indigo-500 to-purple-600",
    borderColor: "border-indigo-500/30",
    badgeColor: "bg-indigo-500/20 text-indigo-400",
    forWho: "Complete beginners & first-time debaters",
    goal: "Deliver a structured argument confidently",
    topics: [
      "Types of debate — Policy, LD, PF, Parliamentary",
      "Claim, Warrant, Impact — building any argument",
      "Affirmative vs. Negative — how sides work",
      "How to flow (take notes during a round)",
      "Cross-examination basics",
      "Writing and delivering a rebuttal",
      "Speaking order, timing, and round structure",
      "Practice: 2-minute constructive speech",
    ],
    coachStyle: "Encouraging, step-by-step, simple language",
  },
  {
    id: "level-2",
    number: 2,
    title: "Strategy",
    subtitle: "Think ahead, adapt to opponents, and win rounds",
    href: "/debate/level-2",
    icon: Swords,
    color: "from-violet-500 to-blue-600",
    borderColor: "border-violet-500/30",
    badgeColor: "bg-violet-500/20 text-violet-400",
    forWho: "Students who know the basics and want to win",
    goal: "Run complex arguments and outmaneuver opponents",
    topics: [
      "Turns — flip an opponent's argument against them",
      "Offensive vs. defensive strategy",
      "Reading the flow — what's winning and what's not",
      "Advanced cross-ex — trap opponents, set up arguments",
      "Block files — prepare responses before the round",
      "Time allocation — where to spend your speaking time",
      "Running multiple off-case positions",
      "Practice: Full cross-examination exchange",
    ],
    coachStyle: "Strategic, challenging, pushes back on weak arguments",
  },
  {
    id: "level-3",
    number: 3,
    title: "Competition",
    subtitle: "Prepare for tournaments and perform under pressure",
    href: "/debate/level-3",
    icon: Trophy,
    color: "from-amber-500 to-rose-600",
    borderColor: "border-amber-500/30",
    badgeColor: "bg-amber-500/20 text-amber-400",
    forWho: "Experienced debaters heading to tournaments",
    goal: "Adapt to any judge and win elimination rounds",
    topics: [
      "Tournament structure — prelims, elims, brackets",
      "Judge adaptation — reading paradigms, adjusting style",
      "Theory and procedural arguments",
      "Kritik debate (K debate) basics",
      "Speed and clarity — when to spread, when to slow",
      "Elimination round pressure management",
      "Post-round analysis — what to fix before next round",
      "Practice: Full timed round simulation",
    ],
    coachStyle: "Brutally honest, technical, tournament-focused",
  },
];

export default function DebateHub() {
  const [experience, setExperience] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("speakup_user");
    if (raw) {
      try {
        const user = JSON.parse(raw);
        setExperience(user.experience ?? null);
      } catch {}
    }
  }, []);

  const recommendedLevel =
    experience === "advanced" ? "level-3"
    : experience === "intermediate" ? "level-2"
    : "level-1";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600">
            <MessageSquare size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            Debate Training
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">Choose Your Level</h1>
        <p className="text-[#94A3B8]">
          Each level builds on the last. Start at Foundations if you&apos;re new, or jump straight
          into Strategy or Competition if you&apos;re ready.
        </p>
      </div>

      {/* Level Cards */}
      <div className="flex flex-col gap-6">
        {LEVELS.map(({ id, number, title, subtitle, href, icon: Icon, color, borderColor, badgeColor, forWho, goal, topics, coachStyle }) => {
          const isRecommended = id === recommendedLevel;

          return (
            <div
              key={id}
              className={clsx(
                "glass-card rounded-2xl border overflow-hidden",
                isRecommended ? "border-[#6366F1]/50" : "border-[#1E293B]"
              )}
            >
              {/* Recommended Banner */}
              {isRecommended && (
                <div className="flex items-center gap-2 border-b border-[#6366F1]/30 bg-[#6366F1]/10 px-5 py-2">
                  <CheckCircle2 size={13} className="text-[#6366F1]" />
                  <span className="text-xs font-semibold text-[#6366F1]">
                    Recommended based on your profile
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Level Header */}
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={clsx("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br", color)}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-semibold", badgeColor)}>
                          Level {number}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-[#F1F5F9]">{title}</h2>
                      <p className="text-sm text-[#94A3B8]">{subtitle}</p>
                    </div>
                  </div>
                  <Link
                    href={href}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#6366F1] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4F46E5]"
                  >
                    Start <ChevronRight size={14} />
                  </Link>
                </div>

                {/* Meta */}
                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                    <p className="mb-0.5 text-xs text-[#94A3B8]">Who it&apos;s for</p>
                    <p className="text-sm font-medium text-[#F1F5F9]">{forWho}</p>
                  </div>
                  <div className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                    <p className="mb-0.5 text-xs text-[#94A3B8]">Your goal</p>
                    <p className="text-sm font-medium text-[#F1F5F9]">{goal}</p>
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                    What you&apos;ll learn
                  </p>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {topics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/20 text-[10px] font-bold text-[#6366F1]">
                          {i + 1}
                        </span>
                        <p className="text-xs text-[#94A3B8]">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coach Style */}
                <div className={clsx("rounded-xl border px-4 py-2.5", borderColor)}>
                  <span className="text-xs text-[#94A3B8]">
                    Coach style: <span className="font-medium text-[#F1F5F9]">{coachStyle}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Locked hint */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
        <Lock size={12} />
        All levels are available. Complete each one to track your progress.
      </div>
    </div>
  );
}
