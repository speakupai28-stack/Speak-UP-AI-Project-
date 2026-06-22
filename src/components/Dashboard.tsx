"use client";

import { useEffect, useState } from "react";
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
  TrendingUp,
  Star,
} from "lucide-react";
import type { UserData } from "@/lib/types";

const SECTION_CARDS = [
  {
    id: "debate",
    label: "Debate",
    description: "Practice arguments, rebuttals, and structured debate formats",
    icon: MessageSquare,
    href: "/debate/level-1",
    gradient: "from-indigo-500 to-purple-600",
    levels: ["Level 1 — Foundations", "Level 2 — Strategy", "Level 3 — Competition"],
  },
  {
    id: "model-un",
    label: "Model UN",
    description: "Draft resolutions, deliver speeches, and lead committees",
    icon: Globe2,
    href: "/model-un",
    gradient: "from-blue-500 to-cyan-600",
    levels: ["Position Papers", "Speeches", "Negotiations"],
  },
  {
    id: "public-speaking",
    label: "Coach",
    description: "Build confidence, pacing, and persuasive delivery",
    icon: Mic2,
    href: "/coach",
    gradient: "from-amber-500 to-orange-600",
    levels: ["Delivery", "Structure", "Presence"],
  },
];

const EXPERIENCE_BADGE: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  intermediate: { label: "Intermediate", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  advanced: { label: "Advanced", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
};

const GOAL_ICONS: Record<string, typeof Trophy> = {
  competition: Trophy,
  class: BookOpen,
  improvement: Sparkles,
  explore: Target,
};

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("speakup_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        // ignore malformed data
      }
    }
    setLoaded(true);
  }, []);

  if (loaded && !user) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-4 text-center px-4">
        <Target size={40} className="text-[#6366F1]" />
        <h1 className="text-2xl font-bold text-[#F1F5F9]">No profile found</h1>
        <p className="text-[#94A3B8]">Complete the onboarding survey to set up your dashboard.</p>
        <Link
          href="/onboarding"
          className="rounded-full bg-[#6366F1] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4F46E5]"
        >
          Get Started
        </Link>
      </div>
    );
  }

  if (!loaded) return null;

  const { name, experience, focus, goal, profile } = user!;
  const badge = EXPERIENCE_BADGE[experience];
  const GoalIcon = GOAL_ICONS[goal] ?? Target;
  const focusSections = SECTION_CARDS.filter((s) => focus.includes(s.id));
  const otherSections = SECTION_CARDS.filter((s) => !focus.includes(s.id));

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-[#F1F5F9]">Welcome back, {name}</h1>
            {badge && (
              <span className={clsx("rounded-full border px-3 py-0.5 text-xs font-semibold", badge.color)}>
                {badge.label}
              </span>
            )}
          </div>
          <p className="text-gradient text-sm font-medium">{profile.tagline}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-2.5">
          <GoalIcon size={16} className="text-[#6366F1]" />
          <span className="text-sm text-[#94A3B8]">
            Goal: <span className="font-medium capitalize text-[#F1F5F9]">{goal.replace("-", " ")}</span>
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Sessions", value: "0", icon: TrendingUp, color: "text-indigo-400" },
          { label: "Streak", value: "0 days", icon: Zap, color: "text-amber-400" },
          { label: "Skills Unlocked", value: "0", icon: Star, color: "text-emerald-400" },
          { label: "Challenges Done", value: "0", icon: Trophy, color: "text-rose-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center gap-2">
              <Icon size={14} className={color} />
              <span className="text-xs text-[#94A3B8]">{label}</span>
            </div>
            <p className="text-xl font-bold text-[#F1F5F9]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — Practice Sections */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Coach Message */}
          <div className="glass-card rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-[#6366F1]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Your Coach</span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[#F1F5F9]">{profile.coachingStyle}</p>
            <div className="rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 p-4">
              <p className="mb-1 text-xs font-semibold text-[#6366F1]">Weekly Goal</p>
              <p className="text-sm text-[#F1F5F9]">{profile.weeklyGoal}</p>
            </div>
          </div>

          {/* Focus Areas */}
          {focusSections.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                Your Focus Areas
              </h2>
              <div className="flex flex-col gap-3">
                {focusSections.map(({ id, label, description, icon: Icon, href, gradient, levels }) => (
                  <Link
                    key={id}
                    href={href}
                    className="card-hover glass-card group flex items-center gap-5 rounded-2xl p-5"
                  >
                    <div className={clsx("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br", gradient)}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#F1F5F9]">{label}</p>
                      <p className="truncate text-sm text-[#94A3B8]">{description}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {levels.map((lvl) => (
                          <span key={lvl} className="rounded-full bg-[#1a2236] px-2 py-0.5 text-xs text-[#94A3B8]">
                            {lvl}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight size={18} className="shrink-0 text-[#94A3B8] transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Explore More */}
          {otherSections.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                Explore More
              </h2>
              <div className="flex flex-col gap-3">
                {otherSections.map(({ id, label, description, icon: Icon, href, gradient }) => (
                  <Link
                    key={id}
                    href={href}
                    className="card-hover glass-card group flex items-center gap-4 rounded-xl p-4 opacity-70 hover:opacity-100"
                  >
                    <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br", gradient)}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#F1F5F9]">{label}</p>
                      <p className="truncate text-xs text-[#94A3B8]">{description}</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-[#94A3B8] transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Sidebar */}
        <div className="flex flex-col gap-4">
          {/* First Challenge */}
          <div className="glass-card rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <Zap size={14} className="text-[#F59E0B]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#F59E0B]">First Challenge</span>
            </div>
            <p className="mb-1 font-semibold text-[#F1F5F9]">{profile.firstChallengeTitle}</p>
            <p className="mb-4 text-sm text-[#94A3B8]">{profile.firstChallengeDescription}</p>
            <Link
              href={focusSections[0]?.href ?? "/coach"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366F1] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4F46E5]"
            >
              Start Challenge
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Skills to Build */}
          <div className="glass-card rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target size={14} className="text-[#6366F1]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Skills to Build</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {profile.topFocusSkills.map((skill, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/20 text-xs font-bold text-[#6366F1]">
                    {i + 1}
                  </span>
                  <span className="text-sm text-[#F1F5F9]">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="glass-card rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Insights</span>
            </div>
            <div className="flex flex-col gap-3">
              {profile.personalizedInsights.map((insight, i) => (
                <p key={i} className="text-sm leading-relaxed text-[#94A3B8]">
                  {insight}
                </p>
              ))}
            </div>
          </div>

          {/* Recommended Start */}
          <div className="rounded-xl border border-[#1E293B] bg-[#111827] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              Recommended Start
            </p>
            <p className="text-sm leading-relaxed text-[#F1F5F9]">{profile.recommendedStart}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
