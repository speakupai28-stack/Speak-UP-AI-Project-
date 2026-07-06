"use client";

import { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { Loader2, RefreshCw, Timer, Zap } from "lucide-react";
import { FeedbackSkeleton } from "@/components/ui/FeedbackSkeleton";
import { ScoreReveal } from "@/components/motion/ScoreReveal";
import { recordSession, getProgress } from "@/lib/progress";
import type { RebuttalResult } from "@/lib/types";

const GRADING_MESSAGES = [
  "Reading your rebuttals…",
  "Checking each response against the argument…",
  "Finding your strongest line…",
  "Writing your next drill…",
];

const ARGUMENTS_BY_LEVEL: Record<number, string[]> = {
  1: [
    "Schools should ban phones because they distract students.",
    "Social media causes loneliness among teenagers.",
    "Homework helps students practice what they learn in class.",
    "Zoos are important because they protect endangered species.",
    "Fast food should be banned because it causes health problems.",
  ],
  2: [
    "Universal basic income would reduce the incentive to work.",
    "Nuclear energy is too dangerous to be part of our energy mix.",
    "Affirmative action creates reverse discrimination.",
    "The death penalty deters serious crime.",
    "Social media companies should be legally responsible for misinformation.",
  ],
  3: [
    "Economic sanctions are an effective tool of foreign policy.",
    "The UN Security Council veto undermines multilateralism.",
    "Developed nations have a legal obligation to accept climate refugees.",
    "Algorithmic content moderation threatens freedom of expression.",
    "Gene editing of human embryos should be permitted for disease prevention.",
  ],
};

const TIME_LIMIT = 90;

interface RebuttalTrainerProps {
  level?: number;
}

export default function RebuttalTrainer({ level: propLevel }: RebuttalTrainerProps) {
  const [level] = useState(() => propLevel ?? getProgress().level);
  const [argument, setArgument] = useState("");
  const [rebuttals, setRebuttals] = useState(["", "", ""]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RebuttalResult | null>(null);
  const [phase, setPhase] = useState<"setup" | "writing" | "feedback">("setup");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const timeUp = phase === "writing" && timeLeft === 0;

  useEffect(() => {
    if (!timerActive || timeLeft === 0) return;
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  function pickArgument() {
    const args = ARGUMENTS_BY_LEVEL[level] ?? ARGUMENTS_BY_LEVEL[1];
    const random = args[Math.floor(Math.random() * args.length)];
    setArgument(random);
    setRebuttals(["", "", ""]);
    setTimeLeft(TIME_LIMIT);
    setTimerActive(true);
    setResult(null);
    setPhase("writing");
  }

  function updateRebuttal(i: number, val: string) {
    setRebuttals((prev) => prev.map((r, idx) => idx === i ? val : r));
  }

  async function submit() {
    setTimerActive(false);
    setLoading(true);
    try {
      const res = await fetch("/api/debate/rebuttal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ argument, rebuttals: rebuttals.filter(Boolean), level }),
      });
      if (!res.ok) throw new Error();
      const data: RebuttalResult = await res.json();
      setResult(data);
      setPhase("feedback");

      recordSession({
        type: "rebuttal",
        level: level as 1 | 2 | 3,
        topic: argument,
        score: data.overallScore,
        weaknesses: [data.weakness],
      });
    } catch {}
    finally { setLoading(false); }
  }

  function reset() {
    setPhase("setup");
    setArgument("");
    setRebuttals(["", "", ""]);
    setResult(null);
    setTimeLeft(TIME_LIMIT);
  }

  const timerColor = timeLeft > 30 ? "text-forest" : timeLeft > 10 ? "text-[#8a6b28]" : "text-maroon";
  const canSubmit = rebuttals.filter(Boolean).length >= 1;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="glass-card rounded-lg p-5">
        <div className="mb-2 flex items-center gap-2">
          <Zap size={16} className="text-[#8a6b28]" />
          <span className="text-xs font-semibold uppercase tracking-wide text-[#8a6b28]">Rebuttal Trainer</span>
          <span className="ml-auto rounded-full border border-ink/10 px-2 py-0.5 text-xs text-ink-soft">Level {level}</span>
        </div>
        <p className="text-sm text-ink-soft">
          {level === 1 && "An argument will appear. Give 3 rebuttals in 90 seconds. Focus on saying WHY it's wrong."}
          {level === 2 && "Attack the argument strategically. Find the link, turn the impact, or offer counter-evidence."}
          {level === 3 && "Run a complete rebuttal: deny the link, turn the impact, and weigh against their argument."}
        </p>
      </div>

      {/* Setup */}
      {phase === "setup" && (
        <button onClick={pickArgument}
          className="flex items-center justify-center gap-2 rounded-md bg-maroon py-4 font-semibold text-paper hover:bg-maroon-dark">
          <Timer size={18} /> Start Rebuttal Challenge
        </button>
      )}

      {/* Writing */}
      {phase === "writing" && (
        <div className="flex flex-col gap-4">
          {/* Argument + Timer */}
          <div className="rounded-lg border border-maroon/30 bg-maroon/10 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-maroon">Argument to Attack</p>
              <div className="flex items-center gap-2">
                <Timer size={14} className={timerColor} />
                <span className={clsx("text-lg font-bold tabular-nums", timerColor)}>
                  {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
            </div>
            <p className="text-base font-medium text-ink">&ldquo;{argument}&rdquo;</p>
          </div>

          {timeUp && (
            <div className="rounded-md border border-maroon/30 bg-maroon/10 px-4 py-3">
              <p className="text-sm font-semibold text-maroon">Time&apos;s up — submit what you have!</p>
            </div>
          )}

          {/* 3 Rebuttal inputs */}
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <label htmlFor={`rebuttal-${i}`} className="mb-1.5 block text-xs font-semibold text-ink-soft">
                  Rebuttal {i + 1} {i === 0 ? "(required)" : "(optional)"}
                </label>
                <textarea
                  id={`rebuttal-${i}`}
                  rows={3}
                  placeholder={
                    i === 0 ? "Your strongest rebuttal..."
                    : i === 1 ? "A second angle of attack..."
                    : "A third rebuttal if you have one..."
                  }
                  value={rebuttals[i]}
                  onChange={(e) => updateRebuttal(i, e.target.value)}
                  className="w-full resize-none rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-sm text-ink placeholder-stone/50 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                />
              </div>
            ))}
          </div>

          <button onClick={submit} disabled={!canSubmit || loading}
            className={clsx("flex items-center justify-center gap-2 rounded-md py-3.5 font-semibold transition-colors",
              canSubmit && !loading ? "bg-maroon text-paper hover:bg-maroon-dark" : "cursor-not-allowed bg-ink/10 text-ink-soft")}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Grading…</> : "Submit Rebuttals"}
          </button>

          {loading && <FeedbackSkeleton messages={GRADING_MESSAGES} rows={4} />}
        </div>
      )}

      {/* Feedback */}
      {phase === "feedback" && result && (
        <ScoreReveal revealKey={result.overallScore} className="flex flex-col gap-4">
          <div className="rounded-lg border border-maroon/30 bg-maroon/10 p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-maroon">Results</span>
              <span className="text-2xl font-bold text-ink">{result.overallScore}/10</span>
            </div>
            <p className="text-sm text-ink-soft">{result.bestRebuttal}</p>
          </div>

          {result.rebuttals.map((r, i) => (
            <div key={i} className="glass-card rounded-lg p-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-ink-soft">Rebuttal {i + 1}</p>
                <span className={clsx("text-sm font-bold", r.score >= 7 ? "text-forest" : r.score >= 4 ? "text-[#8a6b28]" : "text-maroon")}>
                  {r.score}/10
                </span>
              </div>
              <p className="mb-3 text-xs italic text-ink-soft">&ldquo;{r.text}&rdquo;</p>
              <p className="mb-3 text-sm text-ink-soft">{r.feedback}</p>
              <div className="rounded-md border border-ink/10 bg-paper-dim p-3">
                <p className="mb-1 text-xs font-semibold text-maroon">Stronger Version</p>
                <p className="text-xs italic text-ink">&ldquo;{r.improvedVersion}&rdquo;</p>
              </div>
            </div>
          ))}

          <div className="flex items-start gap-3 rounded-md border border-ink/10 bg-paper-dim p-4">
            <Zap size={14} className="mt-0.5 shrink-0 text-[#8a6b28]" />
            <div>
              <p className="text-xs font-semibold text-[#8a6b28]">Next Drill</p>
              <p className="text-sm text-ink">{result.nextDrill}</p>
            </div>
          </div>

          <button onClick={reset} className="flex items-center justify-center gap-2 rounded-md border border-ink/10 py-3 text-sm font-medium text-ink-soft hover:border-maroon/50 hover:text-ink">
            <RefreshCw size={14} /> New Argument
          </button>
        </ScoreReveal>
      )}
    </div>
  );
}
