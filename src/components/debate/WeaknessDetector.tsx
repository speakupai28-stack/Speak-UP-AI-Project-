"use client";

import { useEffect, useState } from "react";
import { Target, TrendingUp, Zap, RefreshCw } from "lucide-react";
import { getProgress, getTopWeaknesses, getRecentSessions } from "@/lib/progress";
import type { DebateProgress } from "@/lib/types";

const DRILLS: Record<string, string> = {
  "impact weighing": "After every argument you write, add one sentence: 'This matters more than the opposition's argument because...'",
  "vague examples": "For your next 3 practice sessions, every claim must include a named country, study, or statistic.",
  "no rebuttal": "Before writing your own argument, write one sentence attacking the strongest thing the opposition could say.",
  "weak warrant": "Practice the 'because ladder': make a claim, then ask 'why?' three times and answer each time.",
  "dropped arguments": "At the end of every speech, list every argument the other side made and confirm you addressed each one.",
  "time allocation": "Set a timer for each argument — 90 seconds max. If you go over, cut the weakest sentence.",
  "missing impact": "End every argument with: 'The consequence of ignoring this is...' before you're allowed to move on.",
  "structure": "Use the template: 'My argument is [claim]. This is true because [warrant]. This matters because [impact].' Every time.",
};

function getDrillForWeakness(weakness: string): string {
  const key = Object.keys(DRILLS).find((k) => weakness.toLowerCase().includes(k));
  return key ? DRILLS[key] : "Practice this specific area in your next 3 sessions and track whether your coach score improves.";
}

export default function WeaknessDetector() {
  const [progress, setProgress] = useState<DebateProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) return null;

  const topWeaknesses = getTopWeaknesses(progress);
  const recentSessions = getRecentSessions(progress, 5);
  const totalSessions = progress.sessions.length;
  const avgScore = totalSessions > 0
    ? Math.round(progress.sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions * 10) / 10
    : 0;

  if (totalSessions === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <Target size={32} className="mx-auto mb-3 text-[#6366F1]" />
        <p className="font-semibold text-[#F1F5F9]">No data yet</p>
        <p className="mt-1 text-sm text-[#94A3B8]">Complete a few practice sessions and your weakness report will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card rounded-2xl p-5">
        <div className="mb-3 flex items-center gap-2">
          <Target size={16} className="text-rose-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-rose-400">Weakness Detector</span>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          {[
            { label: "Sessions", value: totalSessions },
            { label: "Avg Score", value: `${avgScore}/10` },
            { label: "Level", value: progress.level },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3 text-center">
              <p className="text-xl font-bold text-[#F1F5F9]">{value}</p>
              <p className="text-xs text-[#94A3B8]">{label}</p>
            </div>
          ))}
        </div>

        {/* Top Weaknesses */}
        {topWeaknesses.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Your Biggest Weaknesses</p>
            {topWeaknesses.map(({ label, count }, i) => (
              <div key={label} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400">
                      {i + 1}
                    </span>
                    <p className="font-semibold text-[#F1F5F9] capitalize">{label}</p>
                  </div>
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs text-rose-400">×{count} sessions</span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap size={12} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                  <p className="text-xs text-[#94A3B8]">{getDrillForWeakness(label)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#94A3B8]">No consistent weaknesses detected yet. Keep practicing.</p>
        )}
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-[#6366F1]" />
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Recent Sessions</p>
          </div>
          <div className="flex flex-col gap-2">
            {recentSessions.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#0A0F1E] px-4 py-2.5">
                <span className="rounded-full bg-[#1a2236] px-2 py-0.5 text-xs capitalize text-[#94A3B8]">{s.type.replace("_", " ")}</span>
                <p className="flex-1 truncate text-xs text-[#94A3B8]">{s.topic}</p>
                <span className={`text-sm font-bold ${s.score >= 7 ? "text-emerald-400" : s.score >= 5 ? "text-amber-400" : "text-rose-400"}`}>
                  {s.score}/10
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => setProgress(getProgress())} className="flex items-center justify-center gap-2 rounded-xl border border-[#1E293B] py-3 text-sm text-[#94A3B8] hover:border-[#6366F1]/50 hover:text-[#F1F5F9]">
        <RefreshCw size={13} /> Refresh
      </button>
    </div>
  );
}
