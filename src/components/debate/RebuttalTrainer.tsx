"use client";

import { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { Loader2, ArrowRight, CheckCircle2, RefreshCw, Timer, Zap } from "lucide-react";
import { recordSession, getProgress } from "@/lib/progress";
import type { RebuttalResult } from "@/lib/types";

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
  const [level, setLevel] = useState(propLevel ?? 1);
  const [argument, setArgument] = useState("");
  const [rebuttals, setRebuttals] = useState(["", "", ""]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [timerActive, setTimerActive] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RebuttalResult | null>(null);
  const [phase, setPhase] = useState<"setup" | "writing" | "feedback">("setup");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const p = getProgress();
    setLevel(propLevel ?? p.level);
  }, [propLevel]);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setTimeUp(true);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timerActive, timeLeft]);

  function pickArgument() {
    const args = ARGUMENTS_BY_LEVEL[level] ?? ARGUMENTS_BY_LEVEL[1];
    const random = args[Math.floor(Math.random() * args.length)];
    setArgument(random);
    setRebuttals(["", "", ""]);
    setTimeLeft(TIME_LIMIT);
    setTimerActive(true);
    setTimeUp(false);
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
    setTimeUp(false);
    setTimeLeft(TIME_LIMIT);
  }

  const timerColor = timeLeft > 30 ? "text-emerald-400" : timeLeft > 10 ? "text-amber-400" : "text-rose-400";
  const canSubmit = rebuttals.filter(Boolean).length >= 1;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="glass-card rounded-2xl p-5">
        <div className="mb-2 flex items-center gap-2">
          <Zap size={16} className="text-[#F59E0B]" />
          <span className="text-xs font-semibold uppercase tracking-wide text-[#F59E0B]">Rebuttal Trainer</span>
          <span className="ml-auto rounded-full border border-[#1E293B] px-2 py-0.5 text-xs text-[#94A3B8]">Level {level}</span>
        </div>
        <p className="text-sm text-[#94A3B8]">
          {level === 1 && "An argument will appear. Give 3 rebuttals in 90 seconds. Focus on saying WHY it's wrong."}
          {level === 2 && "Attack the argument strategically. Find the link, turn the impact, or offer counter-evidence."}
          {level === 3 && "Run a complete rebuttal: deny the link, turn the impact, and weigh against their argument."}
        </p>
      </div>

      {/* Setup */}
      {phase === "setup" && (
        <button onClick={pickArgument}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#6366F1] py-4 font-semibold text-white hover:bg-[#4F46E5]">
          <Timer size={18} /> Start Rebuttal Challenge
        </button>
      )}

      {/* Writing */}
      {phase === "writing" && (
        <div className="flex flex-col gap-4">
          {/* Argument + Timer */}
          <div className="rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/10 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Argument to Attack</p>
              <div className="flex items-center gap-2">
                <Timer size={14} className={timerColor} />
                <span className={clsx("text-lg font-bold tabular-nums", timerColor)}>
                  {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
            </div>
            <p className="text-base font-medium text-[#F1F5F9]">&ldquo;{argument}&rdquo;</p>
          </div>

          {timeUp && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
              <p className="text-sm font-semibold text-rose-400">Time&apos;s up — submit what you have!</p>
            </div>
          )}

          {/* 3 Rebuttal inputs */}
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <label className="mb-1.5 block text-xs font-semibold text-[#94A3B8]">
                  Rebuttal {i + 1} {i === 0 ? "(required)" : "(optional)"}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    i === 0 ? "Your strongest rebuttal..."
                    : i === 1 ? "A second angle of attack..."
                    : "A third rebuttal if you have one..."
                  }
                  value={rebuttals[i]}
                  onChange={(e) => updateRebuttal(i, e.target.value)}
                  className="w-full resize-none rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/50 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>
            ))}
          </div>

          <button onClick={submit} disabled={!canSubmit || loading}
            className={clsx("flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-colors",
              canSubmit && !loading ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]" : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]")}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Grading…</> : "Submit Rebuttals"}
          </button>
        </div>
      )}

      {/* Feedback */}
      {phase === "feedback" && result && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/10 p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Results</span>
              <span className="text-2xl font-bold text-[#F1F5F9]">{result.overallScore}/10</span>
            </div>
            <p className="text-sm text-[#94A3B8]">{result.bestRebuttal}</p>
          </div>

          {result.rebuttals.map((r, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-[#94A3B8]">Rebuttal {i + 1}</p>
                <span className={clsx("text-sm font-bold", r.score >= 7 ? "text-emerald-400" : r.score >= 4 ? "text-amber-400" : "text-rose-400")}>
                  {r.score}/10
                </span>
              </div>
              <p className="mb-3 text-xs italic text-[#94A3B8]">&ldquo;{r.text}&rdquo;</p>
              <p className="mb-3 text-sm text-[#94A3B8]">{r.feedback}</p>
              <div className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                <p className="mb-1 text-xs font-semibold text-[#6366F1]">Stronger Version</p>
                <p className="text-xs italic text-[#F1F5F9]">&ldquo;{r.improvedVersion}&rdquo;</p>
              </div>
            </div>
          ))}

          <div className="flex items-start gap-3 rounded-xl border border-[#1E293B] bg-[#111827] p-4">
            <Zap size={14} className="mt-0.5 shrink-0 text-[#F59E0B]" />
            <div>
              <p className="text-xs font-semibold text-[#F59E0B]">Next Drill</p>
              <p className="text-sm text-[#F1F5F9]">{result.nextDrill}</p>
            </div>
          </div>

          <button onClick={reset} className="flex items-center justify-center gap-2 rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] hover:border-[#6366F1]/50 hover:text-[#F1F5F9]">
            <RefreshCw size={14} /> New Argument
          </button>
        </div>
      )}
    </div>
  );
}
