"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Loader2, Send, Star, ArrowRight, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { recordSpeakingSession, getSpeakingProgress } from "@/lib/speakingProgress";
import type { EventFeedback } from "@/lib/types";

const EVENTS = [
  { id: "Self-Introduction", duration: "60 sec", focus: "Clarity, warmth, memorability", description: "Make a new audience feel like they already know you in 60 seconds.", tips: ["Start with something unexpected about yourself", "End with what you want them to remember", "Avoid listing facts — tell a tiny story"] },
  { id: "Class Presentation", duration: "3-5 min", focus: "Structure, evidence, engagement", description: "Present information clearly and keep your audience's attention throughout.", tips: ["Hook with a question or surprising stat", "Use signposting: 'First... Second... Finally...'", "Make eye contact with different parts of the room"] },
  { id: "Valedictorian Speech", duration: "3-4 min", focus: "Story, inspiration, personal voice", description: "Reflect on your class journey and inspire everyone in the room.", tips: ["Start with a shared memory the class will recognise", "Be specific — avoid generic graduation clichés", "End with a challenge, not just a thank-you"] },
  { id: "TEDx-Style Talk", duration: "5-7 min", focus: "Big idea, narrative arc, delivery energy", description: "Share one idea worth spreading with a clear narrative and compelling delivery.", tips: ["State your big idea in one sentence by minute 2", "Use the problem → journey → resolution structure", "End with your idea restated in a new, powerful way"] },
  { id: "Persuasive Speech", duration: "3-5 min", focus: "Ethos, Pathos, Logos, call to action", description: "Change your audience's mind or move them to act on something you believe in.", tips: ["Lead with emotion (Pathos), back it with logic (Logos)", "Acknowledge the other side — it builds credibility (Ethos)", "End with a clear, specific call to action"] },
  { id: "Informative Speech", duration: "3-5 min", focus: "Clarity, organisation, audience awareness", description: "Explain something complex in a way that leaves your audience genuinely informed.", tips: ["Chunk information into 3 clear sections", "Use analogies to make abstract things concrete", "Summarise each section before moving to the next"] },
  { id: "Debate Opening Statement", duration: "2-3 min", focus: "Framing, argument preview, confidence", description: "Set up your side of the debate with a commanding, structured opening.", tips: ["Define the debate on your terms in the first 20 seconds", "Preview your 2-3 main arguments clearly", "End with confidence — no hedging language"] },
  { id: "Model UN Opening Speech", duration: "1-2 min", focus: "Formal language, country representation", description: "Deliver your country's position formally and persuasively in committee.", tips: ["Address the chair formally: 'Honourable Chair, distinguished delegates...'", "State your country's position clearly in the first sentence", "End with a call for committee action aligned with your country's interests"] },
  { id: "College Interview Answer", duration: "60-90 sec", focus: "Specificity, authenticity, concise storytelling", description: "Answer a college interview question in a way that makes you memorable.", tips: ["Use the STAR method: Situation, Task, Action, Result", "Be specific — avoid vague statements like 'I'm hardworking'", "End with what you learned or how it connects to your future"] },
  { id: "Elevator Pitch", duration: "30-60 sec", focus: "Hook, value proposition, memorable close", description: "Make someone understand and care about what you do in under 60 seconds.", tips: ["Open with the problem you solve, not who you are", "State your unique value in one sentence", "End with a clear ask or next step"] },
];

interface EventPracticeProps { level?: number; }

export default function EventPractice({ level: propLevel }: EventPracticeProps) {
  const level = propLevel ?? getSpeakingProgress().level;
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null);
  const [speechText, setSpeechText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<EventFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEvent || speechText.trim().length < 30) return;
    setLoading(true); setFeedback(null); setError(null);
    try {
      const res = await fetch("/api/public-speaking/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: selectedEvent.id, speechText, level }),
      });
      if (!res.ok) throw new Error();
      const data: EventFeedback = await res.json();
      setFeedback(data);
      recordSpeakingSession({ type: "event", level: level as 1|2|3, topic: selectedEvent.id, score: data.overallScore, weaknesses: [data.weakness] });
      setTimeout(() => document.getElementById("ep-feedback")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  if (!selectedEvent) {
    return (
      <div className="flex flex-col gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-2">
            <Star size={16} className="text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Event Practice</span>
            <span className="ml-auto rounded-full border border-[#1E293B] px-2 py-0.5 text-xs text-[#94A3B8]">Level {level}</span>
          </div>
          <p className="text-sm text-[#94A3B8]">Choose a real-world speaking event and get feedback calibrated to what judges and audiences actually care about for that format.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {EVENTS.map((event) => (
            <button key={event.id} onClick={() => setSelectedEvent(event)}
              className="card-hover glass-card group rounded-2xl p-4 text-left">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-semibold text-[#F1F5F9]">{event.id}</p>
                <span className="rounded-full bg-[#1a2236] px-2 py-0.5 text-xs text-[#94A3B8]">{event.duration}</span>
              </div>
              <p className="mb-1 text-xs text-amber-400">{event.focus}</p>
              <p className="text-xs text-[#94A3B8]">{event.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#6366F1] transition-all group-hover:gap-2">
                Practice this <ArrowRight size={12} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (feedback) {
    return (
      <div id="ep-feedback" className="flex flex-col gap-4">
        <div className={clsx("rounded-2xl border p-5", feedback.overallScore >= 7 ? "border-emerald-500/30 bg-emerald-500/10" : feedback.overallScore >= 5 ? "border-amber-500/30 bg-amber-500/10" : "border-rose-500/30 bg-rose-500/10")}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">{feedback.event}</span>
            <span className="text-2xl font-bold text-[#F1F5F9]">{feedback.overallScore}/10</span>
          </div>
          <p className="text-sm text-[#F1F5F9]">{feedback.judgeVerdict}</p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Event-Specific Feedback</p>
          <p className="text-sm leading-relaxed text-[#94A3B8]">{feedback.eventSpecificFeedback}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card rounded-2xl p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-400">Strengths</p>
            {feedback.strengths.map((s, i) => <div key={i} className="mb-1.5 flex gap-2"><ArrowRight size={13} className="mt-0.5 shrink-0 text-emerald-400" /><p className="text-sm text-[#94A3B8]">{s}</p></div>)}
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-400">Improvements</p>
            {feedback.improvements.map((imp, i) => <div key={i} className="mb-1.5 flex gap-2"><ArrowRight size={13} className="mt-0.5 shrink-0 text-amber-400" /><p className="text-sm text-[#94A3B8]">{imp}</p></div>)}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card rounded-2xl p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Stronger Opening</p>
            <p className="text-sm italic text-[#94A3B8]">&ldquo;{feedback.openingRewrite}&rdquo;</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Stronger Close</p>
            <p className="text-sm italic text-[#94A3B8]">&ldquo;{feedback.closingRewrite}&rdquo;</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setFeedback(null); setSpeechText(""); }} className="flex-1 rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] hover:border-teal-500/30 hover:text-[#F1F5F9]">
            Try Again
          </button>
          <button onClick={() => { setFeedback(null); setSpeechText(""); setSelectedEvent(null); }} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] hover:border-teal-500/30 hover:text-[#F1F5F9]">
            <RefreshCw size={13} /> New Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-card rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-bold text-[#F1F5F9]">{selectedEvent.id}</p>
            <p className="text-xs text-amber-400">{selectedEvent.focus} · {selectedEvent.duration}</p>
          </div>
          <button onClick={() => setSelectedEvent(null)} className="rounded-xl border border-[#1E293B] px-3 py-1.5 text-xs text-[#94A3B8] hover:border-[#6366F1]/50">
            Change Event
          </button>
        </div>
        <p className="text-sm text-[#94A3B8]">{selectedEvent.description}</p>
      </div>

      <button onClick={() => setShowTips(!showTips)} className="flex items-center gap-2 text-xs font-semibold text-[#6366F1]">
        {showTips ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showTips ? "Hide tips" : "Show tips for this event"}
      </button>

      {showTips && (
        <div className="flex flex-col gap-2 rounded-xl border border-[#1E293B] bg-[#111827] p-4">
          {selectedEvent.tips.map((tip, i) => (
            <div key={i} className="flex gap-2"><ArrowRight size={13} className="mt-0.5 shrink-0 text-amber-400" /><p className="text-sm text-[#94A3B8]">{tip}</p></div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="mb-2 flex justify-between">
            <label className="text-sm font-medium text-[#94A3B8]">Your Speech</label>
            <span className="text-xs text-[#94A3B8]/60">{speechText.length} chars</span>
          </div>
          <textarea rows={10} placeholder={`Write your ${selectedEvent.id.toLowerCase()} here. Keep in mind the format: ${selectedEvent.duration}, focused on ${selectedEvent.focus}.`}
            value={speechText} onChange={(e) => setSpeechText(e.target.value)}
            className="w-full resize-y rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/50 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50" />
        </div>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button type="submit" disabled={speechText.trim().length < 30 || loading}
          className={clsx("flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-colors",
            speechText.trim().length >= 30 && !loading ? "bg-amber-600 text-white hover:bg-amber-700" : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]")}>
          {loading ? <><Loader2 size={16} className="animate-spin" /> Getting event feedback…</> : <><Send size={16} /> Submit for Event Feedback</>}
        </button>
      </form>
    </div>
  );
}
