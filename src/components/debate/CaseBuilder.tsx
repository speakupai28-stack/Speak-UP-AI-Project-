"use client";

import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { Loader2, ArrowRight, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { getProgress } from "@/lib/progress";
import type { BuiltCase } from "@/lib/types";

const MOTIONS_BY_LEVEL: Record<number, string[]> = {
  1: [
    "Schools should have a 4-day school week",
    "Social media does more harm than good",
    "Homework should be abolished",
    "Zoos should be banned",
  ],
  2: [
    "The US should implement universal basic income",
    "Nuclear energy should be expanded to fight climate change",
    "College athletes should be paid",
    "Affirmative action in university admissions should be abolished",
  ],
  3: [
    "The UN Security Council veto power should be abolished",
    "Developed nations have a legal obligation to accept climate refugees",
    "Algorithmic content moderation should be regulated by governments",
    "Gene editing of human embryos should be permitted for disease prevention",
  ],
};

interface CaseBuilderProps {
  level?: number;
}

export default function CaseBuilder({ level: propLevel }: CaseBuilderProps) {
  const [level, setLevel] = useState(propLevel ?? 1);
  const [motion, setMotion] = useState("");
  const [customMotion, setCustomMotion] = useState("");
  const [side, setSide] = useState<"Proposition" | "Opposition">("Proposition");
  const [loading, setLoading] = useState(false);
  const [builtCase, setBuiltCase] = useState<BuiltCase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openArg, setOpenArg] = useState(0);
  const [showSpeech, setShowSpeech] = useState(false);

  useEffect(() => {
    const p = getProgress();
    setLevel(propLevel ?? p.level);
    setMotion(MOTIONS_BY_LEVEL[p.level ?? 1]?.[0] ?? "");
  }, [propLevel]);

  const finalMotion = customMotion.trim() || motion;

  async function handleBuild(e: React.FormEvent) {
    e.preventDefault();
    if (!finalMotion) return;
    setLoading(true); setError(null); setBuiltCase(null);
    try {
      const res = await fetch("/api/debate/case-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motion: finalMotion, side, level }),
      });
      if (!res.ok) throw new Error();
      setBuiltCase(await res.json());
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  const motions = MOTIONS_BY_LEVEL[level] ?? MOTIONS_BY_LEVEL[1];

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-card rounded-2xl p-5">
        <div className="mb-2 flex items-center gap-2">
          <FileText size={16} className="text-[#6366F1]" />
          <span className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Case Builder</span>
          <span className="ml-auto rounded-full border border-[#1E293B] px-2 py-0.5 text-xs text-[#94A3B8]">Level {level}</span>
        </div>
        <p className="text-sm text-[#94A3B8]">
          {level === 1 && "Pick a motion and side — your coach builds a complete case you can deliver."}
          {level === 2 && "Build a strategic case with arguments that anticipate the opposition."}
          {level === 3 && "Generate a competition-level case with evidence, weighing, and a polished opening speech."}
        </p>
      </div>

      {!builtCase && (
        <form onSubmit={handleBuild} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Motion</label>
            <div className="mb-3 grid gap-2 sm:grid-cols-2">
              {motions.map((m) => (
                <button key={m} type="button" onClick={() => { setMotion(m); setCustomMotion(""); }}
                  className={clsx("rounded-xl border px-4 py-2.5 text-left text-sm transition-all",
                    motion === m && !customMotion ? "border-[#6366F1] bg-[#6366F1]/10 text-[#F1F5F9] ring-1 ring-[#6366F1]" : "border-[#1E293B] bg-[#111827] text-[#94A3B8] hover:border-[#6366F1]/50")}>
                  {m}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Or type your own motion…" value={customMotion} onChange={(e) => setCustomMotion(e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Your Side</label>
            <div className="flex gap-2">
              {(["Proposition", "Opposition"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setSide(s)}
                  className={clsx("flex-1 rounded-xl border py-3 text-sm font-semibold transition-all",
                    side === s ? s === "Proposition" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-rose-500/50 bg-rose-500/10 text-rose-400"
                    : "border-[#1E293B] bg-[#111827] text-[#94A3B8]")}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button type="submit" disabled={!finalMotion || loading}
            className={clsx("flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-colors",
              finalMotion && !loading ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]" : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]")}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Building your case…</> : <><FileText size={16} /> Build My Case</>}
          </button>
        </form>
      )}

      {builtCase && (
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/10 p-5">
            <p className="mb-1 text-xs font-semibold text-[#6366F1]">{builtCase.side} — {builtCase.motion}</p>
            <p className="text-lg font-bold text-[#F1F5F9]">Your Case Is Ready</p>
          </div>

          {/* Framing */}
          <div className="glass-card rounded-2xl p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Framing</p>
            <p className="text-sm leading-relaxed text-[#F1F5F9]">{builtCase.framing}</p>
          </div>

          {/* Mechanism */}
          <div className="glass-card rounded-2xl p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Mechanism</p>
            <p className="text-sm leading-relaxed text-[#94A3B8]">{builtCase.mechanism}</p>
          </div>

          {/* Arguments */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="border-b border-[#1E293B] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Arguments</p>
            </div>
            {builtCase.arguments.map((arg, i) => (
              <div key={i} className="border-b border-[#1E293B] last:border-0">
                <button onClick={() => setOpenArg(openArg === i ? -1 : i)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/20 text-xs font-bold text-[#6366F1]">{i + 1}</span>
                  <p className="flex-1 font-semibold text-[#F1F5F9]">{arg.title}</p>
                  {openArg === i ? <ChevronUp size={14} className="text-[#94A3B8]" /> : <ChevronDown size={14} className="text-[#94A3B8]" />}
                </button>
                {openArg === i && (
                  <div className="border-t border-[#1E293B] px-5 pb-4 pt-3 space-y-3">
                    <p className="text-sm text-[#94A3B8]">{arg.explanation}</p>
                    <div className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                      <p className="mb-1 text-xs font-semibold text-indigo-400">Example</p>
                      <p className="text-sm text-[#94A3B8]">{arg.example}</p>
                    </div>
                    <div className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                      <p className="mb-1 text-xs font-semibold text-amber-400">Impact</p>
                      <p className="text-sm text-[#94A3B8]">{arg.impact}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Weighing */}
          <div className="glass-card rounded-2xl p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">Why You Win</p>
            <p className="text-sm leading-relaxed text-[#F1F5F9]">{builtCase.weighing}</p>
          </div>

          {/* Opening Speech */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <button onClick={() => setShowSpeech(!showSpeech)}
              className="flex w-full items-center justify-between px-5 py-4">
              <p className="font-semibold text-[#F1F5F9]">Opening Speech Script</p>
              {showSpeech ? <ChevronUp size={14} className="text-[#94A3B8]" /> : <ChevronDown size={14} className="text-[#94A3B8]" />}
            </button>
            {showSpeech && (
              <div className="border-t border-[#1E293B] px-5 pb-5 pt-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#94A3B8]">{builtCase.openingSpeech}</p>
              </div>
            )}
          </div>

          <button onClick={() => setBuiltCase(null)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] hover:border-[#6366F1]/50 hover:text-[#F1F5F9]">
            <ArrowRight size={14} /> Build Another Case
          </button>
        </div>
      )}
    </div>
  );
}
