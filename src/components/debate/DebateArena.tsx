"use client";

import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { BookOpen, Swords, Timer, FileText, Target, Mic } from "lucide-react";
import ProgressBar from "./ProgressBar";
import RebuttalTrainer from "./RebuttalTrainer";
import CaseBuilder from "./CaseBuilder";
import SparringPartner from "./SparringPartner";
import WeaknessDetector from "./WeaknessDetector";
import { getProgress } from "@/lib/progress";
import type { DebateLevel } from "@/lib/types";

const TABS = [
  { id: "lessons", label: "Lessons", icon: BookOpen },
  { id: "sparring", label: "Sparring", icon: Swords },
  { id: "rebuttal", label: "Rebuttal", icon: Timer },
  { id: "case", label: "Case Builder", icon: FileText },
  { id: "speech", label: "Speech", icon: Mic },
  { id: "weakness", label: "Weaknesses", icon: Target },
] as const;

type Tab = typeof TABS[number]["id"];

const LEVEL_COLORS: Record<number, string> = {
  1: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  2: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  3: "text-amber-400 border-amber-500/30 bg-amber-500/10",
};

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Strategy",
  3: "Competition",
};

interface DebateArenaProps {
  defaultTab?: Tab;
  LessonsComponent: React.ComponentType;
  SpeechComponent: React.ComponentType<{ level?: number }>;
}

export default function DebateArena({ defaultTab = "lessons", LessonsComponent, SpeechComponent }: DebateArenaProps) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [level, setLevel] = useState<DebateLevel>(1);

  useEffect(() => {
    const p = getProgress();
    setLevel(p.level);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      {/* Level Badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className={clsx("rounded-full border px-3 py-0.5 text-xs font-semibold", LEVEL_COLORS[level])}>
          Level {level} — {LEVEL_LABELS[level]}
        </span>
      </div>

      {/* Progress Bar */}
      <ProgressBar onLevelChange={(newLevel) => setLevel(newLevel as DebateLevel)} />

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-[#1E293B] bg-[#111827] p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={clsx("flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-semibold transition-colors min-w-0",
              tab === id ? "bg-[#6366F1] text-white" : "text-[#94A3B8] hover:text-[#F1F5F9]")}>
            <Icon size={12} className="shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "lessons" && <LessonsComponent />}
      {tab === "sparring" && <SparringPartner level={level} />}
      {tab === "rebuttal" && <RebuttalTrainer level={level} />}
      {tab === "case" && <CaseBuilder level={level} />}
      {tab === "speech" && <SpeechComponent level={level} />}
      {tab === "weakness" && <WeaknessDetector />}
    </div>
  );
}
