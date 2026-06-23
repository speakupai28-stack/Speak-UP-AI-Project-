"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Mic2, Loader2, Send, ArrowRight } from "lucide-react";
import { recordSpeakingSession, getSpeakingProgress } from "@/lib/speakingProgress";
import type { SpeechUploadFeedback } from "@/lib/types";

const TOPICS_BY_LEVEL: Record<number, string[]> = {
  1: ["Introduce yourself to a new class", "Talk about something you're passionate about", "Explain your favourite book or movie"],
  2: ["Persuade your audience to change one daily habit", "Explain why your generation will change the world", "Argue for or against social media"],
  3: ["Deliver a TEDx-style talk on a big idea", "Give a valedictory speech for your graduating class", "Pitch a solution to a global problem"],
};

const AREA_COLORS: Record<string, string> = {
  articulation: "text-teal-400",
  structure: "text-indigo-400",
  style: "text-purple-400",
  delivery: "text-amber-400",
  persuasion: "text-emerald-400",
  confidence: "text-rose-400",
};

interface SpeechUploadProps { level?: number; }

export default function SpeechUpload({ level: propLevel }: SpeechUploadProps) {
  const level = propLevel ?? getSpeakingProgress().level;
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
      recordSpeakingSession({ type: "upload", level: level as 1|2|3, topic: finalTopic, score: data.overallScore, weaknesses: [data.weakness] });
      setTimeout(() => document.getElementById("su-feedback")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  const topics = TOPICS_BY_LEVEL[level] ?? TOPICS_BY_LEVEL[1];

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-card rounded-2xl p-5">
        <div className="mb-2 flex items-center gap-2">
          <Mic2 size={16} className="text-teal-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-teal-400">Speech Feedback</span>
          <span className="ml-auto rounded-full border border-[#1E293B] px-2 py-0.5 text-xs text-[#94A3B8]">Level {level}</span>
        </div>
        <p className="text-sm text-[#94A3B8]">
          {level === 1 && "Write your speech and get feedback across 6 dimensions: articulation, structure, style, delivery, persuasion, and confidence."}
          {level === 2 && "Submit a speech for style and delivery analysis. Your coach pushes for personality, vivid language, and engagement."}
          {level === 3 && "Performance-level review. Judged at a real audience standard — every dimension scored for polish and impact."}
        </p>
      </div>

      {!feedback && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Topic</label>
            <div className="mb-3 flex flex-col gap-2">
              {topics.map((t) => (
                <button key={t} type="button" onClick={() => { setTopic(t); setCustomTopic(""); }}
                  className={clsx("rounded-xl border px-4 py-2.5 text-left text-sm transition-all",
                    topic === t && !customTopic ? "border-teal-500/50 bg-teal-500/10 text-[#F1F5F9] ring-1 ring-teal-500/50" : "border-[#1E293B] bg-[#111827] text-[#94A3B8] hover:border-teal-500/30")}>
                  {t}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Or type your own topic…" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50" />
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <label className="text-sm font-medium text-[#94A3B8]">Your Speech</label>
              <span className="text-xs text-[#94A3B8]/60">{speechText.length} chars</span>
            </div>
            <textarea rows={10} placeholder="Write or paste your full speech here. The more detail you give, the more specific the feedback will be."
              value={speechText} onChange={(e) => setSpeechText(e.target.value)}
              className="w-full resize-y rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/50 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50" />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button type="submit" disabled={speechText.trim().length < 30 || loading}
            className={clsx("flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-colors",
              speechText.trim().length >= 30 && !loading ? "bg-teal-600 text-white hover:bg-teal-700" : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]")}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing your speech…</> : <><Send size={16} /> Get Feedback</>}
          </button>
        </form>
      )}

      {feedback && (
        <div id="su-feedback" className="flex flex-col gap-4">
          <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-teal-400">Overall Score</span>
              <span className="text-2xl font-bold text-[#F1F5F9]">{feedback.overallScore}/10</span>
            </div>
            <p className="text-sm text-[#F1F5F9]">{feedback.summary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(["articulation", "structure", "style", "delivery", "persuasion", "confidence"] as const).map((area) => {
              const data = feedback[area];
              return (
                <div key={area} className="glass-card rounded-2xl p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className={clsx("text-xs font-bold uppercase capitalize", AREA_COLORS[area])}>{area}</p>
                    <span className={clsx("text-sm font-bold", data.score >= 7 ? "text-emerald-400" : data.score >= 5 ? "text-amber-400" : "text-rose-400")}>{data.score}/10</span>
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

          <div className="glass-card rounded-2xl p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-400">Stronger Opening</p>
            <p className="text-sm italic leading-relaxed text-[#94A3B8]">&ldquo;{feedback.improvedOpening}&rdquo;</p>
          </div>

          <button onClick={() => { setFeedback(null); setSpeechText(""); }}
            className="rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] hover:border-teal-500/30 hover:text-[#F1F5F9]">
            Try Another Speech
          </button>
        </div>
      )}
    </div>
  );
}
