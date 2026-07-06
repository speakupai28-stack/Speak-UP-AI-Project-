"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Loader2, ArrowRight, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { FeedbackSkeleton } from "@/components/ui/FeedbackSkeleton";
import { ScoreReveal } from "@/components/motion/ScoreReveal";
import { getProgress } from "@/lib/progress";
import type { BuiltCase } from "@/lib/types";

const BUILDING_MESSAGES = [
  "Reading your motion…",
  "Drafting your framing and mechanism…",
  "Building your strongest arguments…",
  "Writing your opening speech…",
];

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
  const [level] = useState(() => propLevel ?? getProgress().level);
  const [motion, setMotion] = useState(() => MOTIONS_BY_LEVEL[level]?.[0] ?? "");
  const [customMotion, setCustomMotion] = useState("");
  const [side, setSide] = useState<"Proposition" | "Opposition">("Proposition");
  const [loading, setLoading] = useState(false);
  const [builtCase, setBuiltCase] = useState<BuiltCase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openArg, setOpenArg] = useState(0);
  const [showSpeech, setShowSpeech] = useState(false);

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
      <div className="glass-card rounded-lg p-5">
        <div className="mb-2 flex items-center gap-2">
          <FileText size={16} className="text-maroon" />
          <span className="text-xs font-semibold uppercase tracking-wide text-maroon">Case Builder</span>
          <span className="ml-auto rounded-full border border-ink/10 px-2 py-0.5 text-xs text-ink-soft">Level {level}</span>
        </div>
        <p className="text-sm text-ink-soft">
          {level === 1 && "Pick a motion and side — your coach builds a complete case you can deliver."}
          {level === 2 && "Build a strategic case with arguments that anticipate the opposition."}
          {level === 3 && "Generate a competition-level case with evidence, weighing, and a polished opening speech."}
        </p>
      </div>

      {!builtCase && (
        <form onSubmit={handleBuild} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-soft">Motion</label>
            <div className="mb-3 grid gap-2 sm:grid-cols-2">
              {motions.map((m) => (
                <button key={m} type="button" onClick={() => { setMotion(m); setCustomMotion(""); }}
                  className={clsx("rounded-md border px-4 py-2.5 text-left text-sm transition-all",
                    motion === m && !customMotion ? "border-maroon bg-maroon/10 text-ink ring-1 ring-maroon" : "border-ink/10 bg-paper-dim text-ink-soft hover:border-maroon/50")}>
                  {m}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Or type your own motion…" value={customMotion} onChange={(e) => setCustomMotion(e.target.value)}
              className="w-full rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-sm text-ink placeholder-stone/60 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink-soft">Your Side</label>
            <div className="flex gap-2">
              {(["Proposition", "Opposition"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setSide(s)}
                  className={clsx("flex-1 rounded-md border py-3 text-sm font-semibold transition-all",
                    side === s ? s === "Proposition" ? "border-forest/50 bg-forest/10 text-forest" : "border-maroon/50 bg-maroon/10 text-maroon"
                    : "border-ink/10 bg-paper-dim text-ink-soft")}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-maroon">{error}</p>}

          <button type="submit" disabled={!finalMotion || loading}
            className={clsx("flex items-center justify-center gap-2 rounded-md py-3.5 font-semibold transition-colors",
              finalMotion && !loading ? "bg-maroon text-paper hover:bg-maroon-dark" : "cursor-not-allowed bg-ink/10 text-ink-soft")}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Building your case…</> : <><FileText size={16} /> Build My Case</>}
          </button>

          {loading && <FeedbackSkeleton messages={BUILDING_MESSAGES} rows={5} />}
        </form>
      )}

      {builtCase && !loading && (
        <ScoreReveal revealKey={builtCase.motion} className="flex flex-col gap-4">
          {/* Header */}
          <div className="rounded-lg border border-maroon/30 bg-maroon/10 p-5">
            <p className="mb-1 text-xs font-semibold text-maroon">{builtCase.side} — {builtCase.motion}</p>
            <p className="text-lg font-bold text-ink">Your Case Is Ready</p>
          </div>

          {/* Framing */}
          <div className="glass-card rounded-lg p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Framing</p>
            <p className="text-sm leading-relaxed text-ink">{builtCase.framing}</p>
          </div>

          {/* Mechanism */}
          <div className="glass-card rounded-lg p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Mechanism</p>
            <p className="text-sm leading-relaxed text-ink-soft">{builtCase.mechanism}</p>
          </div>

          {/* Arguments */}
          <div className="glass-card rounded-lg overflow-hidden">
            <div className="border-b border-ink/10 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Arguments</p>
            </div>
            {builtCase.arguments.map((arg, i) => (
              <div key={i} className="border-b border-ink/10 last:border-0">
                <button onClick={() => setOpenArg(openArg === i ? -1 : i)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon/15 text-xs font-bold text-maroon">{i + 1}</span>
                  <p className="flex-1 font-semibold text-ink">{arg.title}</p>
                  {openArg === i ? <ChevronUp size={14} className="text-ink-soft" /> : <ChevronDown size={14} className="text-ink-soft" />}
                </button>
                {openArg === i && (
                  <div className="border-t border-ink/10 px-5 pb-4 pt-3 space-y-3">
                    <p className="text-sm text-ink-soft">{arg.explanation}</p>
                    <div className="rounded-md border border-ink/10 bg-paper-dim p-3">
                      <p className="mb-1 text-xs font-semibold text-maroon">Example</p>
                      <p className="text-sm text-ink-soft">{arg.example}</p>
                    </div>
                    <div className="rounded-md border border-ink/10 bg-paper-dim p-3">
                      <p className="mb-1 text-xs font-semibold text-[#8a6b28]">Impact</p>
                      <p className="text-sm text-ink-soft">{arg.impact}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Weighing */}
          <div className="glass-card rounded-lg p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-forest">Why You Win</p>
            <p className="text-sm leading-relaxed text-ink">{builtCase.weighing}</p>
          </div>

          {/* Opening Speech */}
          <div className="glass-card rounded-lg overflow-hidden">
            <button onClick={() => setShowSpeech(!showSpeech)}
              className="flex w-full items-center justify-between px-5 py-4">
              <p className="font-semibold text-ink">Opening Speech Script</p>
              {showSpeech ? <ChevronUp size={14} className="text-ink-soft" /> : <ChevronDown size={14} className="text-ink-soft" />}
            </button>
            {showSpeech && (
              <div className="border-t border-ink/10 px-5 pb-5 pt-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{builtCase.openingSpeech}</p>
              </div>
            )}
          </div>

          <button onClick={() => setBuiltCase(null)}
            className="flex items-center justify-center gap-2 rounded-md border border-ink/10 py-3 text-sm font-medium text-ink-soft hover:border-maroon/50 hover:text-ink">
            <ArrowRight size={14} /> Build Another Case
          </button>
        </ScoreReveal>
      )}
    </div>
  );
}
