"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Loader2, Send, Mic, ArrowRight } from "lucide-react";
import { recordSession, getProgress } from "@/lib/progress";
import type { SpeechFeedback as SpeechFeedbackType } from "@/lib/types";

const TOPICS_BY_LEVEL: Record<number, string[]> = {
  1: ["Social media does more harm than good", "Schools should ban phones", "Homework should be abolished"],
  2: ["Universal basic income should be implemented", "Nuclear energy solves climate change", "The death penalty should be abolished"],
  3: ["The UN Security Council veto should be abolished", "Developed nations owe climate refugees legal protection", "Gene editing of human embryos should be permitted"],
};

const SPEECH_TYPES = ["Constructive", "Rebuttal", "Summary", "Final Focus"];

const AREA_COLORS: Record<string, string> = {
  structure: "text-indigo-400",
  argument: "text-purple-400",
  evidence: "text-blue-400",
  rebuttal: "text-rose-400",
  impact: "text-amber-400",
  delivery: "text-emerald-400",
};

interface SpeechFeedbackProps {
  level?: number;
}

export default function SpeechFeedback({ level: propLevel }: SpeechFeedbackProps) {
  const level = propLevel ?? getProgress().level;
  const [topic, setTopic] = useState(TOPICS_BY_LEVEL[level]?.[0] ?? "");
  const [speechType, setSpeechType] = useState(SPEECH_TYPES[0]);
  const [speechText, setSpeechText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<SpeechFeedbackType | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (speechText.trim().length < 30) return;
    setLoading(true); setFeedback(null); setError(null);
    try {
      const res = await fetch("/api/debate/speech-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speechText, topic, speechType, level }),
      });
      if (!res.ok) throw new Error();
      const data: SpeechFeedbackType = await res.json();
      setFeedback(data);
      recordSession({
        type: "speech",
        level: level as 1 | 2 | 3,
        topic,
        score: data.overallScore,
        weaknesses: [data.weakness],
      });
      setTimeout(() => document.getElementById("sf-feedback")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  const topics = TOPICS_BY_LEVEL[level] ?? TOPICS_BY_LEVEL[1];

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-card rounded-2xl p-5">
        <div className="mb-2 flex items-center gap-2">
          <Mic size={16} className="text-[#6366F1]" />
          <span className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Speech Feedback</span>
          <span className="ml-auto rounded-full border border-[#1E293B] px-2 py-0.5 text-xs text-[#94A3B8]">Level {level}</span>
        </div>
        <p className="text-sm text-[#94A3B8]">
          {level === 1 && "Write your speech and get feedback on structure, argument, evidence, rebuttal, impact, and delivery."}
          {level === 2 && "Submit a speech for strategic analysis — your coach checks all 6 dimensions at intermediate standard."}
          {level === 3 && "Tournament-level speech review. Every dimension scored at competition standard."}
        </p>
      </div>

      {!feedback && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Topic</label>
            <div className="flex flex-col gap-2">
              {topics.map((t) => (
                <button key={t} type="button" onClick={() => setTopic(t)}
                  className={clsx("rounded-xl border px-4 py-2.5 text-left text-sm transition-all",
                    topic === t ? "border-[#6366F1] bg-[#6366F1]/10 text-[#F1F5F9] ring-1 ring-[#6366F1]" : "border-[#1E293B] bg-[#111827] text-[#94A3B8] hover:border-[#6366F1]/50")}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Speech Type</label>
            <div className="flex gap-2">
              {SPEECH_TYPES.map((t) => (
                <button key={t} type="button" onClick={() => setSpeechType(t)}
                  className={clsx("flex-1 rounded-xl border py-2.5 text-xs font-medium transition-all",
                    speechType === t ? "border-[#6366F1] bg-[#6366F1]/10 text-[#F1F5F9]" : "border-[#1E293B] bg-[#111827] text-[#94A3B8]")}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-[#94A3B8]">Your Speech</label>
              <span className="text-xs text-[#94A3B8]/60">{speechText.length} chars</span>
            </div>
            <textarea rows={10} placeholder="Write your full speech here…"
              value={speechText} onChange={(e) => setSpeechText(e.target.value)}
              className="w-full resize-y rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/50 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]" />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button type="submit" disabled={speechText.trim().length < 30 || loading}
            className={clsx("flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-colors",
              speechText.trim().length >= 30 && !loading ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]" : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]")}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</> : <><Send size={16} /> Get Feedback</>}
          </button>
        </form>
      )}

      {feedback && (
        <div id="sf-feedback" className="flex flex-col gap-4">
          {/* Summary */}
          <div className="rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/10 p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Overall</span>
              <span className="text-2xl font-bold text-[#F1F5F9]">{feedback.overallScore}/10</span>
            </div>
            <p className="text-sm text-[#F1F5F9]">{feedback.summary}</p>
          </div>

          {/* 6 Areas */}
          <div className="grid gap-3 sm:grid-cols-2">
            {(["structure", "argument", "evidence", "rebuttal", "impact", "delivery"] as const).map((area) => {
              const data = feedback[area];
              return (
                <div key={area} className="glass-card rounded-2xl p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className={clsx("text-xs font-bold uppercase", AREA_COLORS[area])}>{area}</p>
                    <span className={clsx("font-bold text-sm", data.score >= 7 ? "text-emerald-400" : data.score >= 5 ? "text-amber-400" : "text-rose-400")}>
                      {data.score}/10
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-[#94A3B8]">{data.feedback}</p>
                  <div className="flex gap-2 rounded-lg border border-[#1E293B] bg-[#0A0F1E] p-2">
                    <ArrowRight size={12} className="mt-0.5 shrink-0 text-[#6366F1]" />
                    <p className="text-xs text-[#F1F5F9]">{data.tip}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Improved Paragraph */}
          <div className="glass-card rounded-2xl p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Improved Version</p>
            <p className="text-sm italic leading-relaxed text-[#94A3B8]">&ldquo;{feedback.improvedParagraph}&rdquo;</p>
          </div>

          <button onClick={() => { setFeedback(null); setSpeechText(""); }}
            className="rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] hover:border-[#6366F1]/50 hover:text-[#F1F5F9]">
            Try Another Speech
          </button>
        </div>
      )}
    </div>
  );
}
