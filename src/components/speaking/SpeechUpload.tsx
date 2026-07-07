"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Mic2, Loader2, Send, ArrowRight } from "lucide-react";
import { FeedbackSkeleton } from "@/components/ui/FeedbackSkeleton";
import { ScoreReveal } from "@/components/motion/ScoreReveal";
import { useSpeakingProgress } from "@/components/providers/ProgressProvider";
import type { SpeechUploadFeedback } from "@/lib/types";

const ANALYZING_MESSAGES = [
  "Reading your speech…",
  "Scoring articulation, structure, and style…",
  "Checking delivery, persuasion, and confidence…",
  "Writing your coach feedback…",
];

const TOPICS_BY_LEVEL: Record<number, string[]> = {
  1: ["Introduce yourself to a new class", "Talk about something you're passionate about", "Explain your favourite book or movie"],
  2: ["Persuade your audience to change one daily habit", "Explain why your generation will change the world", "Argue for or against social media"],
  3: ["Deliver a TEDx-style talk on a big idea", "Give a valedictory speech for your graduating class", "Pitch a solution to a global problem"],
};

const AREA_COLORS: Record<string, string> = {
  articulation: "text-maroon",
  structure: "text-maroon",
  style: "text-maroon",
  delivery: "text-[#8a6b28]",
  persuasion: "text-forest",
  confidence: "text-maroon",
};

interface SpeechUploadProps { level?: number; }

export default function SpeechUpload({ level: propLevel }: SpeechUploadProps) {
  const { recordSession } = useSpeakingProgress();
  const level = propLevel ?? 1;
  const [topic, setTopic] = useState(TOPICS_BY_LEVEL[level]?.[0] ?? "");
  const [customTopic, setCustomTopic] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<SpeechUploadFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const finalTopic = customTopic.trim() || topic;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (speechText.trim().length < 30) return;
    setLoading(true); setFeedback(null); setError(null);
    try {
      const res = await fetch("/api/public-speaking/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speechText, topic: finalTopic, level }),
      });
      if (!res.ok) throw new Error();
      const data: SpeechUploadFeedback = await res.json();
      setFeedback(data);
      await recordSession({ type: "upload", level: level as 1|2|3, topic: finalTopic, score: data.overallScore, weaknesses: [data.weakness] });
      setTimeout(() => document.getElementById("su-feedback")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  const topics = TOPICS_BY_LEVEL[level] ?? TOPICS_BY_LEVEL[1];

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-card rounded-lg p-5">
        <div className="mb-2 flex items-center gap-2">
          <Mic2 size={16} className="text-maroon" />
          <span className="text-xs font-semibold uppercase tracking-wide text-maroon">Speech Feedback</span>
          <span className="ml-auto rounded-full border border-ink/10 px-2 py-0.5 text-xs text-ink-soft">Level {level}</span>
        </div>
        <p className="text-sm text-ink-soft">
          {level === 1 && "Write your speech and get feedback across 6 dimensions: articulation, structure, style, delivery, persuasion, and confidence."}
          {level === 2 && "Submit a speech for style and delivery analysis. Your coach pushes for personality, vivid language, and engagement."}
          {level === 3 && "Performance-level review. Judged at a real audience standard — every dimension scored for polish and impact."}
        </p>
      </div>

      {!feedback && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-soft">Topic</label>
            <div className="mb-3 flex flex-col gap-2">
              {topics.map((t) => (
                <button key={t} type="button" onClick={() => { setTopic(t); setCustomTopic(""); }}
                  className={clsx("rounded-md border px-4 py-2.5 text-left text-sm transition-all",
                    topic === t && !customTopic ? "border-maroon/50 bg-maroon/10 text-ink ring-1 ring-maroon/50" : "border-ink/10 bg-paper-dim text-ink-soft hover:border-maroon/30")}>
                  {t}
                </button>
              ))}
            </div>
            <input type="text" aria-label="Custom speech topic" placeholder="Or type your own topic…" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-sm text-ink placeholder-stone/60 outline-none focus:border-maroon/50 focus:ring-1 focus:ring-maroon/50" />
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <label htmlFor="su-speech" className="text-sm font-medium text-ink-soft">Your Speech</label>
              <span className="text-xs text-stone/60">{speechText.length} chars</span>
            </div>
            <textarea id="su-speech" rows={10} placeholder="Write or paste your full speech here. The more detail you give, the more specific the feedback will be."
              value={speechText} onChange={(e) => setSpeechText(e.target.value)}
              className="w-full resize-y rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-sm text-ink placeholder-stone/50 outline-none focus:border-maroon/50 focus:ring-1 focus:ring-maroon/50" />
          </div>

          {error && <p className="text-sm text-maroon">{error}</p>}

          <button type="submit" disabled={speechText.trim().length < 30 || loading}
            className={clsx("flex items-center justify-center gap-2 rounded-md py-3.5 font-semibold transition-colors",
              speechText.trim().length >= 30 && !loading ? "bg-maroon text-paper hover:bg-maroon-dark" : "cursor-not-allowed bg-ink/10 text-ink-soft")}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing your speech…</> : <><Send size={16} /> Get Feedback</>}
          </button>

          {loading && <FeedbackSkeleton messages={ANALYZING_MESSAGES} rows={6} />}
        </form>
      )}

      {feedback && !loading && (
        <ScoreReveal revealKey={feedback.overallScore} id="su-feedback" className="flex flex-col gap-4">
          <div className="rounded-lg border border-maroon/30 bg-maroon/10 p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-maroon">Overall Score</span>
              <span className="text-2xl font-bold text-ink">{feedback.overallScore}/10</span>
            </div>
            <p className="text-sm text-ink">{feedback.summary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(["articulation", "structure", "style", "delivery", "persuasion", "confidence"] as const).map((area) => {
              const data = feedback[area];
              return (
                <div key={area} className="glass-card rounded-lg p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className={clsx("text-xs font-bold uppercase capitalize", AREA_COLORS[area])}>{area}</p>
                    <span className={clsx("text-sm font-bold", data.score >= 7 ? "text-forest" : data.score >= 5 ? "text-[#8a6b28]" : "text-maroon")}>{data.score}/10</span>
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

          <div className="glass-card rounded-lg p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-maroon">Stronger Opening</p>
            <p className="text-sm italic leading-relaxed text-ink-soft">&ldquo;{feedback.improvedOpening}&rdquo;</p>
          </div>

          <button onClick={() => { setFeedback(null); setSpeechText(""); }}
            className="rounded-md border border-ink/10 py-3 text-sm font-medium text-ink-soft hover:border-maroon/30 hover:text-ink">
            Try Another Speech
          </button>
        </ScoreReveal>
      )}
    </div>
  );
}
