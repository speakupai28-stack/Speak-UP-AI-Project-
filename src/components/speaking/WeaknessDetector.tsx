"use client";

import { useEffect, useState } from "react";
import { Target, TrendingUp, Zap, RefreshCw } from "lucide-react";
import { getSpeakingProgress, getSpeakingTopWeaknesses, getRecentSpeakingSessions } from "@/lib/speakingProgress";
import type { SpeakingProgress } from "@/lib/types";

const DRILLS: Record<string, string> = {
  "articulation": "Read a passage aloud slowly, emphasising every consonant. Record yourself and listen back.",
  "structure": "Before writing any speech, write a 3-bullet outline: Hook, Point, Close. Never skip this.",
  "style": "Rewrite the same paragraph 3 times with a different emotion each time — serious, energetic, warm.",
  "delivery": "Practice your speech twice as slowly as feels natural. Pause for 2 full seconds after every key point.",
  "persuasion": "Rewrite your weakest argument using all three: a statistic (logos), a story (pathos), and a credential (ethos).",
  "confidence": "Replace every 'I think', 'maybe', 'kind of', and 'sort of' in your speech with nothing or a direct statement.",
  "filler words": "Record yourself speaking for 2 minutes. Count your filler words. Set a goal of zero in the next session.",
  "opening": "Write 5 different opening lines for the same speech. Pick the most grabbing one. Never start with 'Hi, my name is...'",
  "closing": "Your close should be your most memorable line. Write it first, then build the speech to earn it.",
};

function getDrill(weakness: string): string {
  const key = Object.keys(DRILLS).find((k) => weakness.toLowerCase().includes(k));
  return key ? DRILLS[key] : "Focus on this area in your next 3 sessions and compare your scores.";
}

export default function SpeakingWeaknessDetector() {
  const [progress, setProgress] = useState<SpeakingProgress | null>(null);

  useEffect(() => { setProgress(getSpeakingProgress()); }, []);

  if (!progress) return null;

  const topWeaknesses = getSpeakingTopWeaknesses(progress);
  const recentSessions = getRecentSpeakingSessions(progress, 5);
  const totalSessions = progress.sessions.length;
  const avgScore = totalSessions > 0
    ? Math.round(progress.sessions.reduce((s, sess) => s + sess.score, 0) / totalSessions * 10) / 10
    : 0;

  if (totalSessions === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <Target size={32} className="mx-auto mb-3 text-teal-400" />
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
        <div className="mb-4 grid grid-cols-3 gap-3">
          {[{ label: "Sessions", value: totalSessions }, { label: "Avg Score", value: `${avgScore}/10` }, { label: "Level", value: progress.level }].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3 text-center">
              <p className="text-xl font-bold text-[#F1F5F9]">{value}</p>
              <p className="text-xs text-[#94A3B8]">{label}</p>
            </div>
          ))}
        </div>

        {topWeaknesses.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Your Biggest Weaknesses</p>
            {topWeaknesses.map(({ label, count }, i) => (
              <div key={label} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400">{i + 1}</span>
                    <p className="font-semibold text-[#F1F5F9] capitalize">{label}</p>
                  </div>
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs text-rose-400">×{count} sessions</span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap size={12} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                  <p className="text-xs text-[#94A3B8]">{getDrill(label)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#94A3B8]">No consistent weaknesses yet. Keep practicing.</p>
        )}
      </div>

      {recentSessions.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-teal-400" />
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Recent Sessions</p>
          </div>
          <div className="flex flex-col gap-2">
            {recentSessions.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#0A0F1E] px-4 py-2.5">
                <span className="rounded-full bg-[#1a2236] px-2 py-0.5 text-xs capitalize text-[#94A3B8]">{s.type}</span>
                <p className="flex-1 truncate text-xs text-[#94A3B8]">{s.topic}</p>
                <span className={`text-sm font-bold ${s.score >= 7 ? "text-emerald-400" : s.score >= 5 ? "text-amber-400" : "text-rose-400"}`}>{s.score}/10</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => setProgress(getSpeakingProgress())} className="flex items-center justify-center gap-2 rounded-xl border border-[#1E293B] py-3 text-sm text-[#94A3B8] hover:border-teal-500/30 hover:text-[#F1F5F9]">
        <RefreshCw size={13} /> Refresh
      </button>
    </div>
  );
}
