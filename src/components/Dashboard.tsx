"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import {
  MessageSquare,
  Globe2,
  Mic2,
  Trophy,
  Zap,
  CheckCircle2,
  ChevronRight,
  Target,
  BookOpen,
  Sparkles,
  Flame,
  Gauge,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { getProgress } from "@/lib/progress";
import { getSpeakingProgress } from "@/lib/speakingProgress";
import type { UserData } from "@/lib/types";

const SECTION_CARDS = [
  {
    id: "debate",
    label: "Debate",
    description: "Practice arguments, rebuttals, and structured debate formats",
    icon: MessageSquare,
    href: "/debate/level-1",
    levels: ["Level 1 — Foundations", "Level 2 — Strategy", "Level 3 — Competition"],
  },
  {
    id: "model-un",
    label: "Model UN",
    description: "Draft resolutions, deliver speeches, and lead committees",
    icon: Globe2,
    href: "/model-un",
    levels: ["Position Papers", "Speeches", "Negotiations"],
  },
  {
    id: "public-speaking",
    label: "Coach",
    description: "Build confidence, pacing, and persuasive delivery",
    icon: Mic2,
    href: "/coach",
    levels: ["Delivery", "Structure", "Presence"],
  },
];

const EXPERIENCE_BADGE: Record<string, { label: string }> = {
  beginner: { label: "Beginner" },
  intermediate: { label: "Intermediate" },
  advanced: { label: "Advanced" },
};

const GOAL_ICONS: Record<string, typeof Trophy> = {
  competition: Trophy,
  class: BookOpen,
  improvement: Sparkles,
  explore: Target,
};

function dayNumber(dateStr: string): number {
  return Math.floor(new Date(dateStr.slice(0, 10) + "T00:00:00Z").getTime() / 86400000);
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const uniqueDays = Array.from(new Set(dates.map(dayNumber))).sort((a, b) => b - a);
  const todayNum = Math.floor(Date.now() / 86400000);
  let expected = uniqueDays[0] === todayNum - 1 ? todayNum - 1 : todayNum;
  let streak = 0;
  for (const day of uniqueDays) {
    if (day === expected) {
      streak++;
      expected--;
    } else {
      break;
    }
  }
  return streak;
}

function readUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("speakup_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [user] = useState<UserData | null>(() => readUser());
  const [stats] = useState(() => {
    const debate = getProgress();
    const speaking = getSpeakingProgress();
    const allSessions = [...debate.sessions, ...speaking.sessions];
    const scores = allSessions.map((s) => s.score).filter((s) => typeof s === "number");
    const weaknessLabels = new Set([
      ...Object.keys(debate.weaknesses),
      ...Object.keys(speaking.weaknesses),
    ]);

    return {
      sessions: allSessions.length,
      streak: computeStreak(allSessions.map((s) => s.date)),
      avgScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
      focusAreasTracked: weaknessLabels.size,
    };
  });

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-4 px-4 text-center">
        <Target size={40} className="text-maroon" />
        <h1 className="font-display text-2xl font-semibold text-ink">No profile found</h1>
        <p className="text-ink-soft">Complete the onboarding survey to set up your dashboard.</p>
        <ButtonLink href="/onboarding">Get Started</ButtonLink>
      </div>
    );
  }

  const { name, experience, focus, goal, profile } = user;
  const badge = EXPERIENCE_BADGE[experience];
  const GoalIcon = GOAL_ICONS[goal] ?? Target;
  const focusSections = SECTION_CARDS.filter((s) => focus.includes(s.id));
  const otherSections = SECTION_CARDS.filter((s) => !focus.includes(s.id));

  const statTiles = [
    { label: "Sessions", value: String(stats.sessions), icon: Gauge },
    { label: "Day Streak", value: `${stats.streak}`, icon: Flame },
    { label: "Avg. Score", value: stats.avgScore !== null ? `${stats.avgScore.toFixed(1)}/10` : "—", icon: Trophy },
    { label: "Focus Areas Tracked", value: String(stats.focusAreasTracked), icon: Target },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold text-ink">Welcome back, {name}</h1>
            {badge && <Badge variant="maroon">{badge.label}</Badge>}
          </div>
          <p className="text-sm font-medium text-maroon">{profile.tagline}</p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-ink/10 bg-paper-dim px-4 py-2.5">
          <GoalIcon size={16} className="text-maroon" />
          <span className="text-sm text-ink-soft">
            Goal: <span className="font-medium capitalize text-ink">{goal.replace("-", " ")}</span>
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statTiles.map(({ label, value, icon: Icon }) => (
          <Card key={label} padding="sm">
            <div className="mb-2 flex items-center gap-2">
              <Icon size={14} className="text-maroon" />
              <span className="text-xs text-stone">{label}</span>
            </div>
            <p className="font-display text-xl font-semibold text-ink">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — Practice Sections */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Coach Message */}
          <Card padding="md">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-maroon" />
              <span className="text-xs font-semibold uppercase tracking-wide text-maroon">Your Coach</span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-ink">{profile.coachingStyle}</p>
            <div className="rounded-md border border-maroon/20 bg-maroon/5 p-4">
              <p className="mb-1 text-xs font-semibold text-maroon">Weekly Goal</p>
              <p className="text-sm text-ink">{profile.weeklyGoal}</p>
            </div>
          </Card>

          {/* Focus Areas */}
          {focusSections.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">
                Your Focus Areas
              </h2>
              <div className="flex flex-col gap-3">
                {focusSections.map(({ id, label, description, icon: Icon, href, levels }) => (
                  <Link
                    key={id}
                    href={href}
                    className="group flex items-center gap-5 rounded-lg border border-ink/10 bg-paper p-5 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-maroon/10 text-maroon">
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{label}</p>
                      <p className="truncate text-sm text-ink-soft">{description}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {levels.map((lvl) => (
                          <span key={lvl} className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-ink-soft">
                            {lvl}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight size={18} className="shrink-0 text-stone transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Explore More */}
          {otherSections.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">
                Explore More
              </h2>
              <div className="flex flex-col gap-3">
                {otherSections.map(({ id, label, description, icon: Icon, href }) => (
                  <Link
                    key={id}
                    href={href}
                    className={clsx(
                      "group flex items-center gap-4 rounded-md border border-ink/10 bg-paper p-4 opacity-70 shadow-[var(--shadow-card)] transition-opacity hover:opacity-100"
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-maroon/10 text-maroon">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">{label}</p>
                      <p className="truncate text-xs text-ink-soft">{description}</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-stone transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Sidebar */}
        <div className="flex flex-col gap-4">
          {/* First Challenge */}
          <Card padding="md">
            <div className="mb-3 flex items-center gap-2">
              <Zap size={14} className="text-gold" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8a6b28]">First Challenge</span>
            </div>
            <p className="mb-1 font-semibold text-ink">{profile.firstChallengeTitle}</p>
            <p className="mb-4 text-sm text-ink-soft">{profile.firstChallengeDescription}</p>
            <ButtonLink href={focusSections[0]?.href ?? "/coach"} className="w-full">
              Start Challenge
              <ChevronRight size={14} />
            </ButtonLink>
          </Card>

          {/* Skills to Build */}
          <Card padding="md">
            <div className="mb-3 flex items-center gap-2">
              <Target size={14} className="text-maroon" />
              <span className="text-xs font-semibold uppercase tracking-wide text-stone">Skills to Build</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {profile.topFocusSkills.map((skill, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-xs font-bold text-maroon">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink">{skill}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Insights */}
          <Card padding="md">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-forest" />
              <span className="text-xs font-semibold uppercase tracking-wide text-stone">Insights</span>
            </div>
            <div className="flex flex-col gap-3">
              {profile.personalizedInsights.map((insight, i) => (
                <p key={i} className="text-sm leading-relaxed text-ink-soft">
                  {insight}
                </p>
              ))}
            </div>
          </Card>

          {/* Recommended Start */}
          <div className="rounded-md border border-ink/10 bg-paper-dim p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone">
              Recommended Start
            </p>
            <p className="text-sm leading-relaxed text-ink">{profile.recommendedStart}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
