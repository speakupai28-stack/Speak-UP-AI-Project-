"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Mic2, Zap, ArrowUp, ArrowDown, Minus, Loader2 } from "lucide-react";
import { getSpeakingProgress, applySpeakingVerdict, shouldEvaluateSpeaking, getSpeakingTopWeaknesses } from "@/lib/speakingProgress";
import type { SpeakingProgress, SpeakingProgressionDecision } from "@/lib/types";

const LEVEL_LABELS: Record<number, string> = { 1: "Foundations", 2: "Style & Delivery", 3: "Performance" };
const LEVEL_COLORS: Record<number, string> = { 1: "bg-teal-500", 2: "bg-violet-500", 3: "bg-amber-500" };
const LEVEL_TEXT: Record<number, string> = { 1: "text-teal-400", 2: "text-violet-400", 3: "text-amber-400" };

export default function SpeakingProgressBar({ onLevelChange }: { onLevelChange?: (l: number) => void }) {
  const [progress, setProgress] = useState<SpeakingProgress | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [decision, setDecision] = useState<SpeakingProgressionDecision | null>(null);
  const [showDecision, setShowDecision] = useState(false);

  useEffect(() => { setProgress(getSpeakingProgress()); }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = getSpeakingProgress();
      setProgress(fresh);
      if (shouldEvaluateSpeaking(fresh) && !evaluating && !showDecision) runEvaluation(fresh);
    }, 2000);
    return () => clearInterval(interval);
  }, [evaluating, showDecision]);

  async function runEvaluation(p: SpeakingProgress) {
    setEvaluating(true);
    try {
      const res = await fetch("/api/public-speaking/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentLevel: p.level, sessions: p.sessions, weaknesses: p.weaknesses }),
      });
      if (!res.ok) throw new Error();
      const dec: SpeakingProgressionDecision = await res.json();
      setDecision(dec); setShowDecision(true);
    } catch {}
    finally { setEvaluating(false); }
  }

  function handleAccept() {
    if (!decision || !progress) return;
    const updated = applySpeakingVerdict(decision.verdict, progress);
    setProgress(updated); setShowDecision(false); setDecision(null);
    onLevelChange?.(updated.level);
  }

  if (!progress) return null;
  const topWeaknesses = getSpeakingTopWeaknesses(progress);
  const xpPercent = Math.min(progress.xp, 100);

  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="glass-card rounded-2xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={clsx("flex h-7 w-7 items-center justify-center rounded-lg", LEVEL_COLORS[progress.level])}>
              <Mic2 size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Speaking Level</p>
              <p className={clsx("text-sm font-bold", LEVEL_TEXT[progress.level])}>
                Level {progress.level} — {LEVEL_LABELS[progress.level]}
              </p>
            </div>
          </div>
          <p className="text-sm font-bold text-[#F1F5F9]">{xpPercent}%</p>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1E293B]">
          <div className={clsx("h-full rounded-full transition-all duration-700", LEVEL_COLORS[progress.level])} style={{ width: `${xpPercent}%` }} />
        </div>
        <p className="mt-2 text-xs text-[#94A3B8]">
          {evaluating ? <span className="flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Evaluating your progress…</span>
            : xpPercent >= 100 ? "Ready for evaluation"
            : progress.level < 3 ? `Complete more sessions to unlock Level ${progress.level + 1} evaluation`
            : "You've reached the highest level — Performance"}
        </p>
      </div>

      {topWeaknesses.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3">
          <Zap size={14} className="shrink-0 text-[#F59E0B]" />
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-[#94A3B8]">Focus areas:</span>
            {topWeaknesses.map(({ label, count }) => (
              <span key={label} className="rounded-full bg-[#1a2236] px-2 py-0.5 text-xs text-[#F59E0B]">{label} ×{count}</span>
            ))}
          </div>
        </div>
      )}

      {showDecision && decision && (
        <div className="rounded-2xl border border-[#6366F1]/50 bg-[#111827] p-5">
          <div className="mb-4 flex items-center gap-3">
            {decision.verdict === "advance" && <><ArrowUp size={20} className="text-emerald-400" /><p className="font-bold text-emerald-400">Ready to Advance to Level {Math.min(progress.level + 1, 3)}</p></>}
            {decision.verdict === "stay" && <><Minus size={20} className="text-amber-400" /><p className="font-bold text-amber-400">Stay at Level {progress.level}</p></>}
            {decision.verdict === "drop" && <><ArrowDown size={20} className="text-rose-400" /><p className="font-bold text-rose-400">Back to Level 1</p></>}
          </div>
          <p className="mb-4 text-sm text-[#94A3B8]">{decision.reasoning}</p>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-emerald-400">Strengths</p>
              {decision.strengths.map((s, i) => <p key={i} className="mb-1 text-xs text-[#94A3B8]">✓ {s}</p>)}
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-rose-400">Gaps</p>
              {decision.gaps.map((g, i) => <p key={i} className="mb-1 text-xs text-[#94A3B8]">→ {g}</p>)}
            </div>
          </div>
          <div className="mb-4 rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-3">
            <p className="text-xs font-semibold text-[#6366F1]">Next Focus</p>
            <p className="text-sm text-[#F1F5F9]">{decision.nextFocus}</p>
          </div>
          <button onClick={handleAccept}
            className={clsx("w-full rounded-xl py-3 font-semibold text-white transition-colors",
              decision.verdict === "advance" ? "bg-emerald-600 hover:bg-emerald-700"
              : decision.verdict === "drop" ? "bg-rose-600 hover:bg-rose-700"
              : "bg-[#6366F1] hover:bg-[#4F46E5]")}>
            {decision.verdict === "advance" ? `Move to Level ${Math.min(progress.level + 1, 3)}`
              : decision.verdict === "drop" ? "Back to Level 1" : "Continue at This Level"}
          </button>
        </div>
      )}
    </div>
  );
}
