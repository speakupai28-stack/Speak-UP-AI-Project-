"use client";

import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { BookOpen, Mic2, Star, Target } from "lucide-react";
import SpeakingProgressBar from "./ProgressBar";
import SpeechUpload from "./SpeechUpload";
import EventPractice from "./EventPractice";
import SpeakingWeaknessDetector from "./WeaknessDetector";
import { getSpeakingProgress } from "@/lib/speakingProgress";

const TABS = [
  { id: "lessons", label: "Lessons", icon: BookOpen },
  { id: "speech", label: "Speech Feedback", icon: Mic2 },
  { id: "event", label: "Events", icon: Star },
  { id: "weakness", label: "Weaknesses", icon: Target },
] as const;

type Tab = typeof TABS[number]["id"];

const LEVEL_COLORS: Record<number, string> = {
  1: "text-teal-400 border-teal-500/30 bg-teal-500/10",
  2: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  3: "text-amber-400 border-amber-500/30 bg-amber-500/10",
};

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Style & Delivery",
  3: "Performance",
};

interface SpeakingArenaProps {
  LessonsComponent: React.ComponentType;
}

export default function SpeakingArena({ LessonsComponent }: SpeakingArenaProps) {
  const [tab, setTab] = useState<Tab>("lessons");
  const [level, setLevel] = useState(1);

  useEffect(() => {
    setLevel(getSpeakingProgress().level);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <div className="mb-4 flex items-center gap-2">
        <span className={clsx("rounded-full border px-3 py-0.5 text-xs font-semibold", LEVEL_COLORS[level])}>
          Level {level} — {LEVEL_LABELS[level]}
        </span>
      </div>

      <SpeakingProgressBar onLevelChange={(l) => setLevel(l)} />

      <div className="mb-6 flex gap-1 rounded-xl border border-[#1E293B] bg-[#111827] p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={clsx("flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-semibold transition-colors min-w-0",
              tab === id ? "bg-[#6366F1] text-white" : "text-[#94A3B8] hover:text-[#F1F5F9]")}>
            <Icon size={12} className="shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {tab === "lessons" && <LessonsComponent />}
      {tab === "speech" && <SpeechUpload level={level} />}
      {tab === "event" && <EventPractice level={level} />}
      {tab === "weakness" && <SpeakingWeaknessDetector />}
    </div>
  );
}
