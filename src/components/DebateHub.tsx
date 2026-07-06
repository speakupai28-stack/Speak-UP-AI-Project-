"use client";

import { useState } from "react";
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
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

const LEVELS = [
  {
    id: "level-1",
    number: 1,
    title: "Foundations",
    subtitle: "Learn how debate works from the ground up",
    href: "/debate/level-1",
    icon: BookOpen,
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

function readExperience(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("speakup_user");
    return raw ? (JSON.parse(raw).experience ?? null) : null;
  } catch {
    return null;
  }
}

export default function DebateHub() {
  const [experience] = useState<string | null>(() => readExperience());

  const recommendedLevel =
    experience === "advanced" ? "level-3"
    : experience === "intermediate" ? "level-2"
    : "level-1";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-maroon/10 text-maroon">
            <MessageSquare size={18} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-stone">
            Debate Training
          </span>
        </div>
        <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Choose Your Level</h1>
        <p className="text-ink-soft">
          Each level builds on the last. Start at Foundations if you&apos;re new, or jump straight
          into Strategy or Competition if you&apos;re ready.
        </p>
      </div>

      {/* Level Cards */}
      <div className="flex flex-col gap-6">
        {LEVELS.map(({ id, number, title, subtitle, href, icon: Icon, forWho, goal, topics, coachStyle }) => {
          const isRecommended = id === recommendedLevel;

          return (
            <Card
              key={id}
              padding="none"
              className={clsx("overflow-hidden", isRecommended && "border-maroon/40")}
            >
              {isRecommended && (
                <div className="flex items-center gap-2 border-b border-maroon/20 bg-maroon/5 px-5 py-2">
                  <CheckCircle2 size={13} className="text-maroon" />
                  <span className="text-xs font-semibold text-maroon">
                    Recommended based on your profile
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Level Header */}
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-maroon/10 text-maroon">
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="mb-1">
                        <Badge variant="maroon">Level {number}</Badge>
                      </div>
                      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
                      <p className="text-sm text-ink-soft">{subtitle}</p>
                    </div>
                  </div>
                  <ButtonLink href={href} size="sm" className="shrink-0">
                    Start <ChevronRight size={14} />
                  </ButtonLink>
                </div>

                {/* Meta */}
                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-ink/10 bg-paper-dim p-3">
                    <p className="mb-0.5 text-xs text-stone">Who it&apos;s for</p>
                    <p className="text-sm font-medium text-ink">{forWho}</p>
                  </div>
                  <div className="rounded-md border border-ink/10 bg-paper-dim p-3">
                    <p className="mb-0.5 text-xs text-stone">Your goal</p>
                    <p className="text-sm font-medium text-ink">{goal}</p>
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-stone">
                    What you&apos;ll learn
                  </p>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {topics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-[10px] font-bold text-maroon">
                          {i + 1}
                        </span>
                        <p className="text-xs text-ink-soft">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coach Style */}
                <div className="rounded-md border border-ink/10 px-4 py-2.5">
                  <span className="text-xs text-ink-soft">
                    Coach style: <span className="font-medium text-ink">{coachStyle}</span>
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Locked hint */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-stone">
        <Lock size={12} />
        All levels are available. Complete each one to track your progress.
      </div>
    </div>
  );
}
