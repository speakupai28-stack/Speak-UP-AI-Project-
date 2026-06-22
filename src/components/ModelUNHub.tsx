"use client";

import Link from "next/link";
import { clsx } from "clsx";
import {
  Globe2,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Users,
  Search,
  Star,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";

const SECTIONS = [
  {
    id: "section-1",
    number: 1,
    title: "Introduction to Model UN",
    subtitle: "Understand how committees work and your role as a delegate",
    href: "/model-un/intro",
    live: true,
    icon: BookOpen,
    color: "from-teal-500 to-cyan-600",
    borderColor: "border-teal-500/30",
    badgeColor: "bg-teal-500/20 text-teal-400",
    forWho: "Brand new delegates",
    goal: "Understand the structure and speak with confidence",
    topics: [
      "What is Model UN and how committees work",
      "Understanding the delegate role",
      "Rules of procedure — motions, points, yields",
      "How resolutions are structured",
      "Reading and understanding the study guide",
    ],
    coachStyle: "Beginner-friendly, builds confidence step by step",
  },
  {
    id: "section-2",
    number: 2,
    title: "Committee Work & Speeches",
    subtitle: "Learn to lobby, debate, and draft winning resolutions",
    href: "/model-un/committee",
    live: true,
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    borderColor: "border-blue-500/30",
    badgeColor: "bg-blue-500/20 text-blue-400",
    forWho: "Delegates who know the basics",
    goal: "Lead debate and get your resolution passed",
    topics: [
      "Delivering an opening speech (structure, tone, time limits)",
      "Lobbying and forming blocs",
      "Writing and sponsoring working papers",
      "Merging papers and negotiating language",
      "Making and responding to points of information",
      "Voting procedure and amendments",
    ],
    coachStyle: "Tactical, pushes for persuasive and confident delivery",
  },
  {
    id: "section-3",
    number: 3,
    title: "Research & Position Papers",
    subtitle: "Know your country inside out and research like a pro",
    href: "/model-un/research",
    live: true,
    icon: Search,
    color: "from-indigo-500 to-purple-600",
    borderColor: "border-indigo-500/30",
    badgeColor: "bg-indigo-500/20 text-indigo-400",
    forWho: "Any delegate preparing for a conference",
    goal: "Build a strong position paper and research roadmap",
    topics: [
      "Understanding your country's foreign policy",
      "How to research a topic efficiently",
      "Identifying allies, adversaries, and swing votes",
      "Citing credible UN and government sources",
      "Structuring a position paper",
      "Writing policy language that passes",
    ],
    coachStyle: "Analytical, teaches smart research habits",
  },
  {
    id: "section-4",
    number: 4,
    title: "Advanced Delegate Skills",
    subtitle: "Master crisis committees, directives, and chairing",
    href: "/model-un/advanced",
    live: true,
    icon: Star,
    color: "from-violet-500 to-rose-500",
    borderColor: "border-violet-500/30",
    badgeColor: "bg-violet-500/20 text-violet-400",
    forWho: "Experienced delegates aiming for awards",
    goal: "Stand out in crisis committees and lead as chair",
    topics: [
      "Crisis committee mechanics",
      "Writing directives and press releases",
      "Chairing a committee",
      "Advanced negotiation tactics",
      "Best delegate strategies",
    ],
    coachStyle: "High-level, elite-focused coaching",
  },
];

export default function ModelUNHub() {
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

  const recommendedId =
    experience === "advanced" ? "section-3"
    : experience === "intermediate" ? "section-2"
    : "section-1";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-600">
            <Globe2 size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            Model UN Training
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">Choose Your Section</h1>
        <p className="text-[#94A3B8]">
          Work through each section in order or jump to what you need most.
          Section 3 — Research is available now.
        </p>
      </div>

      {/* Section Cards */}
      <div className="flex flex-col gap-5">
        {SECTIONS.map(({ id, number, title, subtitle, href, live, icon: Icon, color, borderColor, badgeColor, forWho, goal, topics, coachStyle }) => {
          const isRecommended = id === recommendedId;

          return (
            <div
              key={id}
              className={clsx(
                "glass-card rounded-2xl border overflow-hidden",
                isRecommended && live ? "border-[#6366F1]/50" : "border-[#1E293B]",
                !live && "opacity-80"
              )}
            >
              {/* Recommended Banner */}
              {isRecommended && live && (
                <div className="flex items-center gap-2 border-b border-[#6366F1]/30 bg-[#6366F1]/10 px-5 py-2">
                  <CheckCircle2 size={13} className="text-[#6366F1]" />
                  <span className="text-xs font-semibold text-[#6366F1]">
                    Recommended based on your profile
                  </span>
                </div>
              )}

              {/* Coming Soon Banner */}
              {!live && (
                <div className="flex items-center gap-2 border-b border-[#1E293B] bg-[#111827] px-5 py-2">
                  <Lock size={12} className="text-[#94A3B8]" />
                  <span className="text-xs font-medium text-[#94A3B8]">Coming soon</span>
                </div>
              )}

              <div className="p-6">
                {/* Section Header */}
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={clsx("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br", color)}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-semibold", badgeColor)}>
                          Section {number}
                        </span>
                        {live && (
                          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                            Live
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-[#F1F5F9]">{title}</h2>
                      <p className="text-sm text-[#94A3B8]">{subtitle}</p>
                    </div>
                  </div>

                  {live ? (
                    <Link
                      href={href}
                      className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#6366F1] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4F46E5]"
                    >
                      Start <ChevronRight size={14} />
                    </Link>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#1E293B] px-4 py-2.5 text-sm font-medium text-[#94A3B8]">
                      <Lock size={13} /> Soon
                    </span>
                  )}
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
                    Coach style:{" "}
                    <span className="font-medium text-[#F1F5F9]">{coachStyle}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
