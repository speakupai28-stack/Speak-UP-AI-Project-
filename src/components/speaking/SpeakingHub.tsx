"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { Mic2, ChevronRight, CheckCircle2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { getSpeakingProgress } from "@/lib/speakingProgress";

const LEVELS = [
  {
    id: "level-1", number: 1, title: "Foundations", subtitle: "Build the core skills every speaker needs",
    href: "/public-speaking/level-1", color: "from-teal-500 to-cyan-600",
    badge: "bg-teal-500/20 text-teal-400 border-teal-500/30", border: "border-teal-500/30",
    forWho: "Students new to public speaking", goal: "Speak clearly and confidently in 60 seconds",
    topics: ["Why speaking matters & beating nerves", "Articulation basics & filler word elimination", "Vocal variety — pace, pitch, pause, volume", "Basic speech structure: Hook, Body, Close", "Body language fundamentals", "Overcoming nervousness", "The 1-minute rule", "Practice: 60-second self-introduction"],
    coachStyle: "Warm, encouraging — focuses on one improvement at a time",
  },
  {
    id: "level-2", number: 2, title: "Style & Delivery", subtitle: "Find your voice and hold the room",
    href: "/public-speaking/level-2", color: "from-violet-500 to-purple-600",
    badge: "bg-violet-500/20 text-violet-400 border-violet-500/30", border: "border-violet-500/30",
    forWho: "Students who can speak but want to be compelling", goal: "Deliver a 3-minute speech with personality and persuasion",
    topics: ["Finding your authentic speaking voice", "Advanced articulation techniques", "Storytelling: problem/journey/resolution arc", "Ethos, Pathos, Logos — the persuasion triangle", "Audience management & reading the room", "Advanced body language & movement", "The power of the strategic pause", "Practice: 3-minute persuasive speech"],
    coachStyle: "Challenging — pushes for personality, risk-taking, and specificity",
  },
  {
    id: "level-3", number: 3, title: "Performance & Events", subtitle: "Prepare for real events and real audiences",
    href: "/public-speaking/level-3", color: "from-amber-500 to-orange-600",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30", border: "border-amber-500/30",
    forWho: "Students preparing for competitions, interviews, or high-stakes events", goal: "Deliver a polished, event-specific speech under pressure",
    topics: ["Adapting to different speaking contexts", "Event-specific mastery (TEDx, Valedictorian, Competition)", "Advanced persuasion & narrative tension", "Handling Q&A and live audience pressure", "Performing under high-stakes conditions", "Vocal stamina for longer speeches", "Mastering the first 10 seconds", "Practice: Full event simulation"],
    coachStyle: "Performance-level — judged at a real audience standard",
  },
];

export default function SpeakingHub() {
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    setCurrentLevel(getSpeakingProgress().level);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-cyan-600">
            <Mic2 size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Public Speaking</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">Choose Your Level</h1>
        <p className="text-[#94A3B8]">A progressive speaking program — from clearing your first fear to commanding any room. The coach evaluates your progress and guides your advancement.</p>
      </div>

      <div className="flex flex-col gap-5">
        {LEVELS.map(({ id, number, title, subtitle, href, color, badge, border, forWho, goal, topics, coachStyle }) => {
          const isRecommended = id === `level-${currentLevel}`;
          return (
            <div key={id} className={clsx("glass-card overflow-hidden rounded-2xl border", isRecommended ? "border-[#6366F1]/50" : "border-[#1E293B]")}>
              {isRecommended && (
                <div className="flex items-center gap-2 border-b border-[#6366F1]/30 bg-[#6366F1]/10 px-5 py-2">
                  <CheckCircle2 size={13} className="text-[#6366F1]" />
                  <span className="text-xs font-semibold text-[#6366F1]">Your current level</span>
                </div>
              )}
              <div className="p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={clsx("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br", color)}>
                      <Mic2 size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className={clsx("rounded-full border px-2.5 py-0.5 text-xs font-semibold", badge)}>Level {number}</span>
                      </div>
                      <h2 className="text-xl font-bold text-[#F1F5F9]">{title}</h2>
                      <p className="text-sm text-[#94A3B8]">{subtitle}</p>
                    </div>
                  </div>
                  <Link href={href}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#6366F1] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4F46E5]">
                    Start <ChevronRight size={14} />
                  </Link>
                </div>

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

                <div className="mb-4">
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">What you&apos;ll learn</p>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {topics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/20 text-[10px] font-bold text-[#6366F1]">{i + 1}</span>
                        <p className="text-xs text-[#94A3B8]">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={clsx("rounded-xl border px-4 py-2.5", border)}>
                  <span className="text-xs text-[#94A3B8]">Coach style: <span className="font-medium text-[#F1F5F9]">{coachStyle}</span></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
        <Lock size={12} /> All levels available. Your coach evaluates when you&apos;re ready to advance.
      </div>
    </div>
  );
}
