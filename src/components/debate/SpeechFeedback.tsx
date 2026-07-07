"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Loader2, Send, Mic, ArrowRight } from "lucide-react";
import { FeedbackSkeleton } from "@/components/ui/FeedbackSkeleton";
import { ScoreReveal } from "@/components/motion/ScoreReveal";
import { useDebateProgress } from "@/components/providers/ProgressProvider";
import type { SpeechFeedback as SpeechFeedbackType } from "@/lib/types";

const ANALYZING_MESSAGES = [
  "Reading your speech…",
  "Scoring structure, argument, and evidence…",
  "Checking rebuttal and impact…",
  "Writing your coach feedback…",
];

const TOPICS_BY_LEVEL: Record<number, string[]> = {
  1: ["Social media does more harm than good", "Schools should ban phones", "Homework should be abolished"],
  2: ["Universal basic income should be implemented", "Nuclear energy solves climate change", "The death penalty should be abolished"],
  3: ["The UN Security Council veto should be abolished", "Developed nations owe climate refugees legal protection", "Gene editing of human embryos should be permitted"],
};

const SPEECH_TYPES = ["Constructive", "Rebuttal", "Summary", "Final Focus"];

const AREA_COLORS: Record<string, string> = {
  structure: "text-maroon",
  argument: "text-maroon",
  evidence: "text-maroon",
  rebuttal: "text-maroon",
  impact: "text-[#8a6b28]",
  delivery: "text-forest",
};

interface SpeechFeedbackProps {
  level?: number;
}

export default function SpeechFeedback({ level: propLevel }: SpeechFeedbackProps) {
  const { recordSession } = useDebateProgress();
  const level = propLevel ?? 1;
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
      await recordSession({
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
      <div className="glass-card rounded-lg p-5">
        <div className="mb-2 flex items-center gap-2">
          <Mic size={16} className="text-maroon" />
          <span className="text-xs font-semibold uppercase tracking-wide text-maroon">Speech Feedback</span>
          <span className="ml-auto rounded-full border border-ink/10 px-2 py-0.5 text-xs text-ink-soft">Level {level}</span>
        </div>
        <p className="text-sm text-ink-soft">
          {level === 1 && "Write your speech and get feedback on structure, argument, evidence, rebuttal, impact, and delivery."}
          {level === 2 && "Submit a speech for strategic analysis — your coach checks all 6 dimensions at intermediate standard."}
          {level === 3 && "Tournament-level speech review. Every dimension scored at competition standard."}
        </p>
      </div>

      {!feedback && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-soft">Topic</label>
            <div className="flex flex-col gap-2">
              {topics.map((t) => (
                <button key={t} type="button" onClick={() => setTopic(t)}
                  className={clsx("rounded-md border px-4 py-2.5 text-left text-sm transition-all",
                    topic === t ? "border-maroon bg-maroon/10 text-ink ring-1 ring-maroon" : "border-ink/10 bg-paper-dim text-ink-soft hover:border-maroon/50")}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink-soft">Speech Type</label>
            <div className="flex gap-2">
              {SPEECH_TYPES.map((t) => (
                <button key={t} type="button" onClick={() => setSpeechType(t)}
                  className={clsx("flex-1 rounded-md border py-2.5 text-xs font-medium transition-all",
                    speechType === t ? "border-maroon bg-maroon/10 text-ink" : "border-ink/10 bg-paper-dim text-ink-soft")}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="sf-speech" className="text-sm font-medium text-ink-soft">Your Speech</label>
              <span className="text-xs text-stone/60">{speechText.length} chars</span>
            </div>
            <textarea id="sf-speech" rows={10} placeholder="Write your full speech here…"
              value={speechText} onChange={(e) => setSpeechText(e.target.value)}
              className="w-full resize-y rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-sm text-ink placeholder-stone/50 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon" />
          </div>

          {error && <p className="text-sm text-maroon">{error}</p>}

          <button type="submit" disabled={speechText.trim().length < 30 || loading}
            className={clsx("flex items-center justify-center gap-2 rounded-md py-3.5 font-semibold transition-colors",
              speechText.trim().length >= 30 && !loading ? "bg-maroon text-paper hover:bg-maroon-dark" : "cursor-not-allowed bg-ink/10 text-ink-soft")}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</> : <><Send size={16} /> Get Feedback</>}
          </button>

          {loading && <FeedbackSkeleton messages={ANALYZING_MESSAGES} rows={6} />}
        </form>
      )}

      {feedback && !loading && (
        <ScoreReveal revealKey={feedback.overallScore} id="sf-feedback" className="flex flex-col gap-4">
          {/* Summary */}
          <div className="rounded-lg border border-maroon/30 bg-maroon/10 p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-maroon">Overall</span>
              <span className="text-2xl font-bold text-ink">{feedback.overallScore}/10</span>
            </div>
            <p className="text-sm text-ink">{feedback.summary}</p>
          </div>

          {/* 6 Areas */}
          <div className="grid gap-3 sm:grid-cols-2">
            {(["structure", "argument", "evidence", "rebuttal", "impact", "delivery"] as const).map((area) => {
              const data = feedback[area];
              return (
                <div key={area} className="glass-card rounded-lg p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className={clsx("text-xs font-bold uppercase", AREA_COLORS[area])}>{area}</p>
                    <span className={clsx("font-bold text-sm", data.score >= 7 ? "text-forest" : data.score >= 5 ? "text-[#8a6b28]" : "text-maroon")}>
                      {data.score}/10
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-ink-soft">{data.feedback}</p>
                  <div className="flex gap-2 rounded-lg border border-ink/10 bg-paper-dim p-2">
                    <ArrowRight size={12} className="mt-0.5 shrink-0 text-maroon" />
                    <p className="text-xs text-ink">{data.tip}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Improved Paragraph */}
          <div className="glass-card rounded-lg p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-maroon">Improved Version</p>
            <p className="text-sm italic leading-relaxed text-ink-soft">&ldquo;{feedback.improvedParagraph}&rdquo;</p>
          </div>

          <button onClick={() => { setFeedback(null); setSpeechText(""); }}
            className="rounded-md border border-ink/10 py-3 text-sm font-medium text-ink-soft hover:border-maroon/50 hover:text-ink">
            Try Another Speech
          </button>
        </ScoreReveal>
      )}
    </div>
  );
}
