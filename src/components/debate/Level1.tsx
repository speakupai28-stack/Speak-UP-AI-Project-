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
import { FeedbackSkeleton } from "@/components/ui/FeedbackSkeleton";
import { ScoreReveal } from "@/components/motion/ScoreReveal";
import type { DebateLevel1Feedback } from "@/lib/types";

const ANALYZING_MESSAGES = [
  "Reading your speech…",
  "Checking your Claim, Warrant, Impact…",
  "Weighing your strengths and gaps…",
  "Writing your coach feedback…",
];

// ── Lesson Data (follows blueprint exactly) ─────────────────────────────────

const LESSONS = [
  {
    id: 1,
    icon: MessageSquare,
    title: "What Is Debate?",
    color: "bg-maroon/10",
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
    color: "bg-maroon/10",
    concept: "Every strong argument has three parts. Miss one and your argument falls apart.",
    cwi: [
      { label: "Claim", color: "text-maroon", desc: "The point you're making — your position.", example: '"Social media harms mental health."' },
      { label: "Warrant", color: "text-maroon", desc: "The reason or evidence that proves your claim.", example: '"Studies show teens who use social media 3+ hours daily report 40% higher rates of anxiety."' },
      { label: "Impact", color: "text-[#8a6b28]", desc: "Why it matters — the real-world consequence.", example: '"This means millions of teenagers are suffering preventable mental health crises."' },
    ],
    takeaway: "Claim + Warrant + Impact = a complete argument. Always write all three.",
  },
  {
    id: 3,
    icon: Swords,
    title: "Sides: AFF/NEG and Pro/Con",
    color: "bg-maroon/10",
    concept: "Every debate round has two sides. The names differ by format — but the logic is the same: one side supports the resolution, one opposes it.",
    sides: [
      { name: "Affirmative / Pro", color: "text-forest", desc: "Supports the resolution. Goes first. Has the burden of proof — must show the resolution is true. Called 'Affirmative' (AFF) in LD and Policy; called 'Pro' in Public Forum." },
      { name: "Negative / Con", color: "text-maroon", desc: "Opposes the resolution. Responds to the AFF/Pro. Must prove the other side is wrong or hasn't met their burden. Called 'Negative' (NEG) in LD and Policy; called 'Con' in Public Forum." },
    ],
    takeaway: "LD & Policy use Affirmative/Negative. Public Forum uses Pro/Con. Parliamentary uses Government/Opposition.",
  },
  {
    id: 4,
    icon: List,
    title: "How to Flow",
    color: "bg-maroon/10",
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
    color: "bg-maroon/10",
    concept: "Cross-ex (CX) is a period where one team questions the other. It's not a fight — it's a tool to clarify, expose weaknesses, and set up your own arguments.",
    dos: ["Ask short, specific questions", "Listen carefully to their answers", "Use their answers in your next speech", "Stay calm and confident"],
    donts: ["Make speeches instead of asking questions", "Ask questions you don't know the answer to", "Get into arguments — ask and move on", "Use cross-ex to be aggressive"],
    takeaway: "Cross-ex is about gathering ammunition for your next speech, not winning in the moment.",
  },
  {
    id: 6,
    icon: RotateCcw,
    title: "Writing a Rebuttal",
    color: "bg-maroon/10",
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
    color: "bg-maroon/10",
    concept: "Every format has its own speech order. These are the three main NSDA formats — know which one your tournament uses.",
    formats: [
      {
        name: "Public Forum (PF)",
        speeches: [
          { speech: "Pro Constructive", time: "4 min", desc: "Pro presents their case" },
          { speech: "Con Constructive", time: "4 min", desc: "Con presents their case" },
          { speech: "Crossfire", time: "3 min", desc: "1st speakers question each other" },
          { speech: "Pro Rebuttal", time: "4 min", desc: "Pro attacks Con's case" },
          { speech: "Con Rebuttal", time: "4 min", desc: "Con attacks Pro's case" },
          { speech: "Crossfire", time: "3 min", desc: "1st speakers again" },
          { speech: "Pro Summary", time: "3 min", desc: "Pro narrows to best arguments" },
          { speech: "Con Summary", time: "3 min", desc: "Con narrows to best arguments" },
          { speech: "Grand Crossfire", time: "3 min", desc: "All 4 speakers" },
          { speech: "Pro Final Focus", time: "2 min", desc: "Pro's last word" },
          { speech: "Con Final Focus", time: "2 min", desc: "Con's last word" },
        ],
      },
      {
        name: "Lincoln-Douglas (LD)",
        speeches: [
          { speech: "1AC — 1st Affirmative Constructive", time: "6 min", desc: "AFF presents value, criterion, contentions" },
          { speech: "CX", time: "3 min", desc: "NEG questions AFF" },
          { speech: "1NC — 1st Negative Constructive", time: "7 min", desc: "NEG presents case + attacks AFF" },
          { speech: "CX", time: "3 min", desc: "AFF questions NEG" },
          { speech: "1AR — 1st Affirmative Rebuttal", time: "4 min", desc: "AFF rebuilds and attacks NEG" },
          { speech: "2NR — 2nd Negative Rebuttal", time: "6 min", desc: "NEG crystallises and collapses" },
          { speech: "2AR — 2nd Affirmative Rebuttal", time: "3 min", desc: "AFF's final word" },
        ],
      },
      {
        name: "Policy (CX)",
        speeches: [
          { speech: "1AC", time: "9 min", desc: "AFF team reads their plan" },
          { speech: "CX", time: "3 min", desc: "NEG questions" },
          { speech: "1NC", time: "9 min", desc: "NEG runs off-case and on-case arguments" },
          { speech: "CX", time: "3 min", desc: "AFF questions" },
          { speech: "2AC", time: "9 min", desc: "AFF extends and answers" },
          { speech: "CX → 2NC → CX → 1NR → 1AR → 2NR → 2AR", time: "varies", desc: "Rebuttals and final speeches" },
        ],
      },
    ],
    takeaway: "Know your format before you walk in the room. PF uses Pro/Con. LD and Policy use AFF/NEG.",
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
    <div className="glass-card overflow-hidden rounded-lg">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <div className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", lesson.color)}>
          <Icon size={16} className="text-maroon" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-soft">Lesson {lesson.id}</span>
          </div>
          <p className="font-semibold text-ink">{lesson.title}</p>
        </div>
        {open ? <ChevronUp size={16} className="shrink-0 text-ink-soft" /> : <ChevronDown size={16} className="shrink-0 text-ink-soft" />}
      </button>

      {open && (
        <div className="border-t border-ink/10 px-5 pb-5 pt-4 space-y-4">
          <p className="text-sm leading-relaxed text-ink-soft">{lesson.concept}</p>

          {/* Types (Lesson 1) */}
          {"types" in lesson && (
            <div className="grid gap-2 sm:grid-cols-2">
              {(lesson as typeof LESSONS[0] & { types: { name: string; desc: string }[] }).types.map((t) => (
                <div key={t.name} className="rounded-md border border-ink/10 bg-paper-dim p-3">
                  <p className="mb-0.5 text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-soft">{t.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* CWI (Lesson 2) */}
          {"cwi" in lesson && (
            <div className="flex flex-col gap-3">
              {(lesson as typeof LESSONS[1] & { cwi: { label: string; color: string; desc: string; example: string }[] }).cwi.map((c) => (
                <div key={c.label} className="rounded-md border border-ink/10 bg-paper-dim p-4">
                  <p className={clsx("mb-1 text-sm font-bold", c.color)}>{c.label}</p>
                  <p className="mb-2 text-sm text-ink-soft">{c.desc}</p>
                  <p className="text-xs italic text-maroon">{c.example}</p>
                </div>
              ))}
            </div>
          )}

          {/* Sides (Lesson 3) */}
          {"sides" in lesson && (
            <div className="grid gap-3 sm:grid-cols-2">
              {(lesson as typeof LESSONS[2] & { sides: { name: string; color: string; desc: string }[] }).sides.map((s) => (
                <div key={s.name} className="rounded-md border border-ink/10 bg-paper-dim p-4">
                  <p className={clsx("mb-1 font-bold", s.color)}>{s.name}</p>
                  <p className="text-sm text-ink-soft">{s.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tips (Lesson 4) */}
          {"tips" in lesson && !("steps" in lesson) && (
            <div className="flex flex-col gap-2">
              {(lesson as { tips: string[] }).tips.map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-maroon" />
                  <p className="text-sm text-ink-soft">{tip}</p>
                </div>
              ))}
            </div>
          )}

          {/* Dos/Donts (Lesson 5) */}
          {"dos" in lesson && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-forest">Do</p>
                <div className="flex flex-col gap-1.5">
                  {(lesson as { dos: string[] }).dos.map((d, i) => (
                    <div key={i} className="flex gap-2">
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-forest" />
                      <p className="text-sm text-ink-soft">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-maroon">Don&apos;t</p>
                <div className="flex flex-col gap-1.5">
                  {(lesson as { donts: string[] }).donts.map((d, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="mt-0.5 shrink-0 text-maroon text-xs">✕</span>
                      <p className="text-sm text-ink-soft">{d}</p>
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
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon/15 text-xs font-bold text-maroon">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{s.step}</p>
                    <p className="text-xs text-ink-soft">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Round structure by format (Lesson 7) */}
          {"formats" in lesson && (
            <div className="flex flex-col gap-5">
              {(lesson as { formats: { name: string; speeches: { speech: string; time: string; desc: string }[] }[] }).formats.map((fmt) => (
                <div key={fmt.name}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-maroon">{fmt.name}</p>
                  <div className="flex flex-col gap-1.5">
                    {fmt.speeches.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-md border border-ink/10 bg-paper-dim p-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-bold text-ink-soft">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink">{s.speech}</p>
                          {s.desc && <p className="text-xs text-ink-soft">{s.desc}</p>}
                        </div>
                        <span className="shrink-0 rounded-full bg-maroon/15 px-2 py-0.5 text-xs text-maroon">{s.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lesson 8 tips */}
          {"tips" in lesson && "steps" in lesson && (
            <div className="flex flex-col gap-2">
              {(lesson as { tips: string[] }).tips.map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-maroon" />
                  <p className="text-sm text-ink-soft">{tip}</p>
                </div>
              ))}
            </div>
          )}

          {/* Takeaway */}
          <div className="rounded-md border border-maroon/30 bg-maroon/10 px-4 py-3">
            <div className="flex gap-2">
              <Lightbulb size={14} className="mt-0.5 shrink-0 text-maroon" />
              <p className="text-sm font-medium text-ink">{lesson.takeaway}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackPanel({ feedback }: { feedback: DebateLevel1Feedback }) {
  const scoreColor =
    feedback.overallScore >= 8 ? "text-forest"
    : feedback.overallScore >= 5 ? "text-[#8a6b28]"
    : "text-maroon";

  return (
    <div className="flex flex-col gap-4">
      {/* Score + Encouragement */}
      <div className="rounded-lg border border-maroon/30 bg-maroon/10 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-maroon" />
            <span className="text-xs font-semibold uppercase tracking-wide text-maroon">Coach Feedback</span>
          </div>
          <span className={clsx("text-2xl font-bold", scoreColor)}>
            {feedback.overallScore}/10
          </span>
        </div>
        <p className="text-sm leading-relaxed text-ink">{feedback.encouragement}</p>
      </div>

      {/* CWI Breakdown */}
      <div className="glass-card rounded-lg p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">CWI Breakdown</p>
        <div className="flex flex-col gap-3">
          {[
            { label: "Claim", color: "text-maroon", borderColor: "border-maroon/30", bg: "bg-maroon/10", data: feedback.claimAnalysis },
            { label: "Warrant", color: "text-maroon", borderColor: "border-maroon/30", bg: "bg-maroon/10", data: feedback.warrantAnalysis },
            { label: "Impact", color: "text-[#8a6b28]", borderColor: "border-gold/30", bg: "bg-gold/10", data: feedback.impactAnalysis },
          ].map(({ label, color, borderColor, bg, data }) => (
            <div key={label} className={clsx("rounded-md border p-3", borderColor, bg)}>
              <div className="mb-1 flex items-center gap-2">
                <span className={clsx("text-xs font-bold", color)}>{label}</span>
                {data.found
                  ? <CheckCircle2 size={12} className="text-forest" />
                  : <span className="text-xs text-maroon">Missing</span>
                }
              </div>
              {data.quote && (
                <p className="mb-1.5 rounded bg-black/20 px-2 py-1 text-xs italic text-ink-soft">
                  &ldquo;{data.quote}&rdquo;
                </p>
              )}
              <p className="text-xs text-ink-soft">{data.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="glass-card rounded-lg p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-forest">What You Did Well</p>
        <div className="flex flex-col gap-2">
          {feedback.strengths.map((s, i) => (
            <div key={i} className="flex gap-2">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-forest" />
              <p className="text-sm text-ink">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Improvements */}
      <div className="glass-card rounded-lg p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8a6b28]">To Improve</p>
        <div className="flex flex-col gap-2">
          {feedback.improvements.map((imp, i) => (
            <div key={i} className="flex gap-2">
              <ArrowRight size={14} className="mt-0.5 shrink-0 text-[#8a6b28]" />
              <p className="text-sm text-ink-soft">{imp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rewrite Example */}
      <div className="glass-card rounded-lg p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-maroon">How to Rewrite It</p>
        <p className="text-sm italic leading-relaxed text-ink-soft">&ldquo;{feedback.rewriteExample}&rdquo;</p>
      </div>

      {/* Next Step */}
      <div className="flex items-start gap-3 rounded-md border border-ink/10 bg-paper-dim p-4">
        <Zap size={16} className="mt-0.5 shrink-0 text-[#8a6b28]" />
        <div>
          <p className="mb-0.5 text-xs font-semibold text-[#8a6b28]">Next Step</p>
          <p className="text-sm text-ink">{feedback.nextStep}</p>
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
          <span className="rounded-full border border-maroon/30 bg-maroon/10 px-3 py-0.5 text-xs font-semibold text-maroon">
            Level 1
          </span>
          <span className="rounded-full border border-ink/10 px-3 py-0.5 text-xs text-ink-soft">
            Foundations
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-ink">Debate Foundations</h1>
        <p className="text-ink-soft">
          Learn how debate works, master the CWI argument model, and deliver your first speech — all from scratch.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-md border border-ink/10 bg-paper-dim p-1">
        {(["learn", "practice"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold capitalize transition-colors",
              activeTab === tab
                ? "bg-maroon text-paper"
                : "text-ink-soft hover:text-ink"
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
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-maroon py-3.5 font-semibold text-paper transition-colors hover:bg-maroon-dark"
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
              <label className="mb-2 block text-sm font-medium text-ink-soft">
                Choose a debate topic
              </label>
              <div className="mb-3 grid gap-2 sm:grid-cols-2">
                {PRACTICE_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setTopic(t); setCustomTopic(""); }}
                    className={clsx(
                      "rounded-md border px-4 py-2.5 text-left text-sm transition-all",
                      topic === t && !customTopic
                        ? "border-maroon bg-maroon/10 text-ink ring-1 ring-maroon"
                        : "border-ink/10 bg-paper-dim text-ink-soft hover:border-maroon/50"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                aria-label="Custom debate topic"
                placeholder="Or type your own topic…"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="w-full rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-sm text-ink placeholder-stone/60 outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon"
              />
            </div>

            {/* Speech Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink-soft">Speech type</label>
              <div className="flex gap-2">
                {SPEECH_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSpeechType(t)}
                    className={clsx(
                      "flex-1 rounded-md border py-2.5 text-sm font-medium transition-all",
                      speechType === t
                        ? "border-maroon bg-maroon/10 text-ink ring-1 ring-maroon"
                        : "border-ink/10 bg-paper-dim text-ink-soft hover:border-maroon/50"
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
                <label htmlFor="l1-speech" className="text-sm font-medium text-ink-soft">Write your speech</label>
                <span className="text-xs text-stone/60">Aim for 2 minutes (~250–300 words)</span>
              </div>
              <div className="mb-2 rounded-md border border-ink/10 bg-paper-dim/50 px-4 py-3">
                <p className="text-xs text-ink-soft">
                  💡 Remember: <span className="text-maroon">Claim</span> → <span className="text-maroon">Warrant</span> → <span className="text-[#8a6b28]">Impact</span> for each argument
                </p>
              </div>
              <textarea
                id="l1-speech"
                rows={10}
                placeholder={`Write your ${speechType.toLowerCase()} here. Include at least 2 complete CWI arguments.\n\nExample start: "I stand in affirmation of the resolution that ${finalTopic}. My first argument is..."`}
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                className="w-full resize-y rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-sm text-ink placeholder-stone/50 outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon"
              />
              <p className="mt-1.5 text-right text-xs text-stone/50">{speechText.length} characters</p>
            </div>

            {error && <p className="text-sm text-maroon">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={clsx(
                "flex items-center justify-center gap-2 rounded-md py-3.5 font-semibold transition-colors",
                canSubmit && !loading
                  ? "bg-maroon text-paper hover:bg-maroon-dark"
                  : "cursor-not-allowed bg-ink/10 text-ink-soft"
              )}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Analyzing your speech…</>
              ) : (
                <><Send size={16} /> Submit for Feedback</>
              )}
            </button>
          </form>

          {/* Designed wait */}
          {loading && <FeedbackSkeleton messages={ANALYZING_MESSAGES} rows={5} />}

          {/* Feedback */}
          {feedback && !loading && (
            <div id="feedback-panel">
              <ScoreReveal revealKey={feedback.overallScore}>
                <FeedbackPanel feedback={feedback} />
              </ScoreReveal>
              <button
                onClick={() => { setFeedback(null); setSpeechText(""); }}
                className="mt-4 w-full rounded-md border border-ink/10 py-3 text-sm font-medium text-ink-soft transition-colors hover:border-maroon/50 hover:text-ink"
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
