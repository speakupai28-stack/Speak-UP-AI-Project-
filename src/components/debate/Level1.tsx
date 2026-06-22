"use client";

import { useState } from "react";
import { clsx } from "clsx";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Loader2,
  Send,
  Star,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  MessageSquare,
  List,
  Swords,
  RotateCcw,
  Clock,
  Mic,
} from "lucide-react";
import type { DebateLevel1Feedback } from "@/lib/types";

// ── Lesson Data (follows blueprint exactly) ─────────────────────────────────

const LESSONS = [
  {
    id: 1,
    icon: MessageSquare,
    title: "What Is Debate?",
    color: "bg-indigo-500",
    concept: "Debate is a structured argument between two sides on a specific topic called a resolution. One side argues FOR it (Affirmative) and one side argues AGAINST it (Negative).",
    types: [
      { name: "Policy (CX)", desc: "2v2 teams debate policy resolutions, very fast-paced" },
      { name: "Lincoln-Douglas (LD)", desc: "1v1 focused on values and philosophy" },
      { name: "Public Forum (PF)", desc: "2v2, current events topics, most accessible" },
      { name: "Parliamentary", desc: "Team debate with limited prep time" },
    ],
    takeaway: "Every debate has two sides, a resolution, and structured speaking turns.",
  },
  {
    id: 2,
    icon: Target,
    title: "Claim, Warrant, Impact (CWI)",
    color: "bg-purple-500",
    concept: "Every strong argument has three parts. Miss one and your argument falls apart.",
    cwi: [
      { label: "Claim", color: "text-indigo-400", desc: "The point you're making — your position.", example: '"Social media harms mental health."' },
      { label: "Warrant", color: "text-purple-400", desc: "The reason or evidence that proves your claim.", example: '"Studies show teens who use social media 3+ hours daily report 40% higher rates of anxiety."' },
      { label: "Impact", color: "text-amber-400", desc: "Why it matters — the real-world consequence.", example: '"This means millions of teenagers are suffering preventable mental health crises."' },
    ],
    takeaway: "Claim + Warrant + Impact = a complete argument. Always write all three.",
  },
  {
    id: 3,
    icon: Swords,
    title: "Affirmative vs. Negative",
    color: "bg-blue-500",
    concept: "In every debate round you're assigned a side. Your job is to argue that side — even if you personally disagree.",
    sides: [
      { name: "Affirmative (AFF)", color: "text-emerald-400", desc: "Supports the resolution. Goes first. Has the burden of proof — must show the resolution is true." },
      { name: "Negative (NEG)", color: "text-rose-400", desc: "Opposes the resolution. Responds to the AFF. Has to prove the AFF is wrong or doesn't meet their burden." },
    ],
    takeaway: "Affirmative starts and must prove the resolution. Negative tears down that proof.",
  },
  {
    id: 4,
    icon: List,
    title: "How to Flow",
    color: "bg-cyan-500",
    concept: 'Flowing is taking notes during a debate round. Debaters use a special shorthand to track every argument so nothing gets "dropped" (unanswered).',
    tips: [
      "Use abbreviations: 'b/c' = because, 'w/' = with, '+' = and, '→' = leads to",
      "Write the AFF arguments in one column, NEG responses in the next",
      "Circle dropped arguments — unanswered points mean the other team wins that argument",
      "Don't write full sentences — keywords only",
    ],
    takeaway: "A good flow means you never miss an argument. Practice flowing speeches from videos.",
  },
  {
    id: 5,
    icon: MessageSquare,
    title: "Cross-Examination Basics",
    color: "bg-teal-500",
    concept: "Cross-ex (CX) is a period where one team questions the other. It's not a fight — it's a tool to clarify, expose weaknesses, and set up your own arguments.",
    dos: ["Ask short, specific questions", "Listen carefully to their answers", "Use their answers in your next speech", "Stay calm and confident"],
    donts: ["Make speeches instead of asking questions", "Ask questions you don't know the answer to", "Get into arguments — ask and move on", "Use cross-ex to be aggressive"],
    takeaway: "Cross-ex is about gathering ammunition for your next speech, not winning in the moment.",
  },
  {
    id: 6,
    icon: RotateCcw,
    title: "Writing a Rebuttal",
    color: "bg-violet-500",
    concept: "A rebuttal is your response to the other team's arguments. You're not just saying they're wrong — you're explaining WHY they're wrong with evidence.",
    steps: [
      { step: "1. Point", desc: 'Name the argument you\'re responding to. "They said social media doesn\'t harm teens..."' },
      { step: "2. Counter", desc: 'Explain why it\'s wrong. "But this ignores the data from..."' },
      { step: "3. Evidence", desc: "Back up your counter with proof." },
      { step: "4. Impact", desc: "Explain why your response matters more than theirs." },
    ],
    takeaway: "Good rebuttals follow the Point → Counter → Evidence → Impact structure.",
  },
  {
    id: 7,
    icon: Clock,
    title: "Round Structure & Speaking Order",
    color: "bg-amber-500",
    concept: "Every debate format has a set speaking order. Here's how a basic Public Forum round works:",
    order: [
      { speech: "1AC — First Affirmative Constructive", time: "4 min", who: "AFF", desc: "AFF presents their case" },
      { speech: "Cross-Ex", time: "2 min", who: "NEG questions AFF", desc: "" },
      { speech: "1NC — First Negative Constructive", time: "4 min", who: "NEG", desc: "NEG presents their case + rebuttals" },
      { speech: "Cross-Ex", time: "2 min", who: "AFF questions NEG", desc: "" },
      { speech: "Summary Speeches", time: "3 min each", who: "Both", desc: "Narrow the debate to key issues" },
      { speech: "Final Focus", time: "2 min each", who: "Both", desc: "Why your side wins the round" },
    ],
    takeaway: "Know your speech times. Running over or under hurts your credibility.",
  },
  {
    id: 8,
    icon: Mic,
    title: "Practice: Constructive Speech",
    color: "bg-rose-500",
    concept: "Time to put it all together. A constructive speech introduces your side's arguments. Pick a topic below, write your speech using CWI for each argument, then submit it for feedback.",
    tips: ["Aim for 2 minutes of speaking", "Include at least 2 complete CWI arguments", "Start with a hook or opening line", "End with a clear statement of your position"],
    takeaway: "Your first speech doesn't need to be perfect — it needs to be complete.",
  },
];

const PRACTICE_TOPICS = [
  "Social media does more harm than good",
  "Schools should have a 4-day school week",
  "Homework should be abolished",
  "Zoos should be banned",
  "Climate change is the biggest threat to humanity",
  "Cell phones should be banned in schools",
];

const SPEECH_TYPES = ["Constructive Speech", "Cross-Examination Questions", "Rebuttal"];

// ── Sub-components ───────────────────────────────────────────────────────────

function LessonCard({ lesson, index }: { lesson: typeof LESSONS[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const Icon = lesson.icon;

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <div className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", lesson.color)}>
          <Icon size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#94A3B8]">Lesson {lesson.id}</span>
          </div>
          <p className="font-semibold text-[#F1F5F9]">{lesson.title}</p>
        </div>
        {open ? <ChevronUp size={16} className="shrink-0 text-[#94A3B8]" /> : <ChevronDown size={16} className="shrink-0 text-[#94A3B8]" />}
      </button>

      {open && (
        <div className="border-t border-[#1E293B] px-5 pb-5 pt-4 space-y-4">
          <p className="text-sm leading-relaxed text-[#94A3B8]">{lesson.concept}</p>

          {/* Types (Lesson 1) */}
          {"types" in lesson && (
            <div className="grid gap-2 sm:grid-cols-2">
              {(lesson as typeof LESSONS[0] & { types: { name: string; desc: string }[] }).types.map((t) => (
                <div key={t.name} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                  <p className="mb-0.5 text-sm font-semibold text-[#F1F5F9]">{t.name}</p>
                  <p className="text-xs text-[#94A3B8]">{t.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* CWI (Lesson 2) */}
          {"cwi" in lesson && (
            <div className="flex flex-col gap-3">
              {(lesson as typeof LESSONS[1] & { cwi: { label: string; color: string; desc: string; example: string }[] }).cwi.map((c) => (
                <div key={c.label} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-4">
                  <p className={clsx("mb-1 text-sm font-bold", c.color)}>{c.label}</p>
                  <p className="mb-2 text-sm text-[#94A3B8]">{c.desc}</p>
                  <p className="text-xs italic text-[#6366F1]">{c.example}</p>
                </div>
              ))}
            </div>
          )}

          {/* Sides (Lesson 3) */}
          {"sides" in lesson && (
            <div className="grid gap-3 sm:grid-cols-2">
              {(lesson as typeof LESSONS[2] & { sides: { name: string; color: string; desc: string }[] }).sides.map((s) => (
                <div key={s.name} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-4">
                  <p className={clsx("mb-1 font-bold", s.color)}>{s.name}</p>
                  <p className="text-sm text-[#94A3B8]">{s.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tips (Lesson 4) */}
          {"tips" in lesson && !("steps" in lesson) && (
            <div className="flex flex-col gap-2">
              {(lesson as { tips: string[] }).tips.map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-[#6366F1]" />
                  <p className="text-sm text-[#94A3B8]">{tip}</p>
                </div>
              ))}
            </div>
          )}

          {/* Dos/Donts (Lesson 5) */}
          {"dos" in lesson && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">Do</p>
                <div className="flex flex-col gap-1.5">
                  {(lesson as { dos: string[] }).dos.map((d, i) => (
                    <div key={i} className="flex gap-2">
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-400" />
                      <p className="text-sm text-[#94A3B8]">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-400">Don&apos;t</p>
                <div className="flex flex-col gap-1.5">
                  {(lesson as { donts: string[] }).donts.map((d, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="mt-0.5 shrink-0 text-rose-400 text-xs">✕</span>
                      <p className="text-sm text-[#94A3B8]">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Steps (Lesson 6) */}
          {"steps" in lesson && (
            <div className="flex flex-col gap-3">
              {(lesson as { steps: { step: string; desc: string }[] }).steps.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/20 text-xs font-bold text-[#6366F1]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#F1F5F9]">{s.step}</p>
                    <p className="text-xs text-[#94A3B8]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Speaking order (Lesson 7) */}
          {"order" in lesson && (
            <div className="flex flex-col gap-2">
              {(lesson as { order: { speech: string; time: string; who: string; desc: string }[] }).order.map((o, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2236] text-xs font-bold text-[#94A3B8]">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#F1F5F9]">{o.speech}</p>
                    {o.desc && <p className="text-xs text-[#94A3B8]">{o.desc}</p>}
                  </div>
                  <span className="shrink-0 rounded-full bg-[#6366F1]/20 px-2 py-0.5 text-xs text-[#6366F1]">{o.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* Lesson 8 tips */}
          {"tips" in lesson && "steps" in lesson && (
            <div className="flex flex-col gap-2">
              {(lesson as { tips: string[] }).tips.map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-[#6366F1]" />
                  <p className="text-sm text-[#94A3B8]">{tip}</p>
                </div>
              ))}
            </div>
          )}

          {/* Takeaway */}
          <div className="rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-3">
            <div className="flex gap-2">
              <Lightbulb size={14} className="mt-0.5 shrink-0 text-[#6366F1]" />
              <p className="text-sm font-medium text-[#F1F5F9]">{lesson.takeaway}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackPanel({ feedback }: { feedback: DebateLevel1Feedback }) {
  const scoreColor =
    feedback.overallScore >= 8 ? "text-emerald-400"
    : feedback.overallScore >= 5 ? "text-amber-400"
    : "text-rose-400";

  return (
    <div className="flex flex-col gap-4">
      {/* Score + Encouragement */}
      <div className="rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/10 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-[#6366F1]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Coach Feedback</span>
          </div>
          <span className={clsx("text-2xl font-bold", scoreColor)}>
            {feedback.overallScore}/10
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[#F1F5F9]">{feedback.encouragement}</p>
      </div>

      {/* CWI Breakdown */}
      <div className="glass-card rounded-2xl p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">CWI Breakdown</p>
        <div className="flex flex-col gap-3">
          {[
            { label: "Claim", color: "text-indigo-400", borderColor: "border-indigo-500/30", bg: "bg-indigo-500/10", data: feedback.claimAnalysis },
            { label: "Warrant", color: "text-purple-400", borderColor: "border-purple-500/30", bg: "bg-purple-500/10", data: feedback.warrantAnalysis },
            { label: "Impact", color: "text-amber-400", borderColor: "border-amber-500/30", bg: "bg-amber-500/10", data: feedback.impactAnalysis },
          ].map(({ label, color, borderColor, bg, data }) => (
            <div key={label} className={clsx("rounded-xl border p-3", borderColor, bg)}>
              <div className="mb-1 flex items-center gap-2">
                <span className={clsx("text-xs font-bold", color)}>{label}</span>
                {data.found
                  ? <CheckCircle2 size={12} className="text-emerald-400" />
                  : <span className="text-xs text-rose-400">Missing</span>
                }
              </div>
              {data.quote && (
                <p className="mb-1.5 rounded bg-black/20 px-2 py-1 text-xs italic text-[#94A3B8]">
                  &ldquo;{data.quote}&rdquo;
                </p>
              )}
              <p className="text-xs text-[#94A3B8]">{data.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="glass-card rounded-2xl p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-400">What You Did Well</p>
        <div className="flex flex-col gap-2">
          {feedback.strengths.map((s, i) => (
            <div key={i} className="flex gap-2">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
              <p className="text-sm text-[#F1F5F9]">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Improvements */}
      <div className="glass-card rounded-2xl p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-400">To Improve</p>
        <div className="flex flex-col gap-2">
          {feedback.improvements.map((imp, i) => (
            <div key={i} className="flex gap-2">
              <ArrowRight size={14} className="mt-0.5 shrink-0 text-amber-400" />
              <p className="text-sm text-[#94A3B8]">{imp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rewrite Example */}
      <div className="glass-card rounded-2xl p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6366F1]">How to Rewrite It</p>
        <p className="text-sm italic leading-relaxed text-[#94A3B8]">&ldquo;{feedback.rewriteExample}&rdquo;</p>
      </div>

      {/* Next Step */}
      <div className="flex items-start gap-3 rounded-xl border border-[#1E293B] bg-[#111827] p-4">
        <Zap size={16} className="mt-0.5 shrink-0 text-[#F59E0B]" />
        <div>
          <p className="mb-0.5 text-xs font-semibold text-[#F59E0B]">Next Step</p>
          <p className="text-sm text-[#F1F5F9]">{feedback.nextStep}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Level1() {
  const [activeTab, setActiveTab] = useState<"learn" | "practice">("learn");
  const [topic, setTopic] = useState(PRACTICE_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [speechType, setSpeechType] = useState(SPEECH_TYPES[0]);
  const [speechText, setSpeechText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<DebateLevel1Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const finalTopic = customTopic.trim() || topic;
  const canSubmit = speechText.trim().length > 30;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setFeedback(null);
    setError(null);
    try {
      const res = await fetch("/api/debate/level-1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: finalTopic, speechType, speechText }),
      });
      if (!res.ok) throw new Error("Feedback failed");
      setFeedback(await res.json());
      setTimeout(() => document.getElementById("feedback-panel")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold text-indigo-400">
            Level 1
          </span>
          <span className="rounded-full border border-[#1E293B] px-3 py-0.5 text-xs text-[#94A3B8]">
            Foundations
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">Debate Foundations</h1>
        <p className="text-[#94A3B8]">
          Learn how debate works, master the CWI argument model, and deliver your first speech — all from scratch.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-xl border border-[#1E293B] bg-[#111827] p-1">
        {(["learn", "practice"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold capitalize transition-colors",
              activeTab === tab
                ? "bg-[#6366F1] text-white"
                : "text-[#94A3B8] hover:text-[#F1F5F9]"
            )}
          >
            {tab === "learn" ? <BookOpen size={14} /> : <Mic size={14} />}
            {tab === "learn" ? "8 Lessons" : "Practice"}
          </button>
        ))}
      </div>

      {/* Learn Tab */}
      {activeTab === "learn" && (
        <div className="flex flex-col gap-3">
          {LESSONS.map((lesson, i) => (
            <LessonCard key={lesson.id} lesson={lesson} index={i} />
          ))}
          <button
            onClick={() => setActiveTab("practice")}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366F1] py-3.5 font-semibold text-white transition-colors hover:bg-[#4F46E5]"
          >
            I&apos;m ready to practice <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Practice Tab */}
      {activeTab === "practice" && (
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Topic Selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#94A3B8]">
                Choose a debate topic
              </label>
              <div className="mb-3 grid gap-2 sm:grid-cols-2">
                {PRACTICE_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setTopic(t); setCustomTopic(""); }}
                    className={clsx(
                      "rounded-xl border px-4 py-2.5 text-left text-sm transition-all",
                      topic === t && !customTopic
                        ? "border-[#6366F1] bg-[#6366F1]/10 text-[#F1F5F9] ring-1 ring-[#6366F1]"
                        : "border-[#1E293B] bg-[#111827] text-[#94A3B8] hover:border-[#6366F1]/50"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or type your own topic…"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="w-full rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 outline-none transition-colors focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
              />
            </div>

            {/* Speech Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Speech type</label>
              <div className="flex gap-2">
                {SPEECH_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSpeechType(t)}
                    className={clsx(
                      "flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all",
                      speechType === t
                        ? "border-[#6366F1] bg-[#6366F1]/10 text-[#F1F5F9] ring-1 ring-[#6366F1]"
                        : "border-[#1E293B] bg-[#111827] text-[#94A3B8] hover:border-[#6366F1]/50"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Speech Text */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-[#94A3B8]">Write your speech</label>
                <span className="text-xs text-[#94A3B8]/60">Aim for 2 minutes (~250–300 words)</span>
              </div>
              <div className="mb-2 rounded-xl border border-[#1E293B] bg-[#111827]/50 px-4 py-3">
                <p className="text-xs text-[#94A3B8]">
                  💡 Remember: <span className="text-indigo-400">Claim</span> → <span className="text-purple-400">Warrant</span> → <span className="text-amber-400">Impact</span> for each argument
                </p>
              </div>
              <textarea
                rows={10}
                placeholder={`Write your ${speechType.toLowerCase()} here. Include at least 2 complete CWI arguments.\n\nExample start: "I stand in affirmation of the resolution that ${finalTopic}. My first argument is..."`}
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                className="w-full resize-y rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
              />
              <p className="mt-1.5 text-right text-xs text-[#94A3B8]/50">{speechText.length} characters</p>
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={clsx(
                "flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-colors",
                canSubmit && !loading
                  ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                  : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]"
              )}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Analyzing your speech…</>
              ) : (
                <><Send size={16} /> Submit for Feedback</>
              )}
            </button>
          </form>

          {/* Feedback */}
          {feedback && (
            <div id="feedback-panel">
              <FeedbackPanel feedback={feedback} />
              <button
                onClick={() => { setFeedback(null); setSpeechText(""); }}
                className="mt-4 w-full rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] transition-colors hover:border-[#6366F1]/50 hover:text-[#F1F5F9]"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
