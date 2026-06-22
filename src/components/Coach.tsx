"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Mic2, Loader2, Send, ArrowRight, Star, Zap, ChevronRight } from "lucide-react";

const CONTEXTS = [
  "Class Presentation", "Debate Opening Speech", "Model UN Speech",
  "Job Interview", "College Essay Reading", "Persuasive Speech",
];

const GOALS = [
  "Sound more confident", "Be clearer and easier to follow",
  "Be more persuasive", "Improve my pacing and energy",
  "Write a stronger opening", "Make my conclusion more memorable",
];

const TIPS = [
  { icon: "🎯", title: "Hook First", tip: "Your first sentence is the most important. If you lose them there, you never get them back. Start with a question, a bold statement, or a surprising fact." },
  { icon: "🌊", title: "Vary Your Pace", tip: "Speed up when excited, slow down for emphasis. A monotone voice loses audiences in under 60 seconds. Pause intentionally — silence commands attention." },
  { icon: "💪", title: "Own Your Space", tip: "Stand tall, make eye contact, and gesture naturally. Slouching or looking at notes sends insecurity signals. Your body language speaks before your words do." },
  { icon: "🔁", title: "Rule of Three", tip: "Group ideas in threes. Our brains love it. 'Life, liberty, and the pursuit of happiness.' Three points, three examples, three reasons. Memorable every time." },
  { icon: "📍", title: "Signpost Everything", tip: "Tell them what you're going to say, say it, then tell them what you said. 'First... Second... Finally... In conclusion...' Never let your audience get lost." },
  { icon: "🎭", title: "Emotion Wins", tip: "Facts inform. Stories persuade. Emotion moves people to act. Include at least one personal story or vivid example in every speech. Make them feel something." },
];

export default function Coach() {
  const [speechText, setSpeechText] = useState("");
  const [context, setContext] = useState(CONTEXTS[0]);
  const [goal, setGoal] = useState(GOALS[0]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"practice" | "tips">("practice");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (speechText.trim().length < 30) return;
    setLoading(true); setFeedback(null); setError(null);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speechText, context, goal }),
      });
      if (!res.ok) throw new Error();
      setFeedback(await res.json());
      setTimeout(() => document.getElementById("coach-feedback")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-orange-600">
            <Mic2 size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Communication Coach</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">Public Speaking Coach</h1>
        <p className="text-[#94A3B8]">Write your speech, get personalized feedback on delivery, structure, and persuasion.</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-xl border border-[#1E293B] bg-[#111827] p-1">
        {(["practice", "tips"] as const).map((t) => (
          <button key={t} onClick={() => setView(t)}
            className={clsx("flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold capitalize transition-colors",
              view === t ? "bg-[#6366F1] text-white" : "text-[#94A3B8] hover:text-[#F1F5F9]")}>
            {t === "practice" ? <Mic2 size={14} /> : <Star size={14} />}
            {t === "practice" ? "Get Feedback" : "Speaking Tips"}
          </button>
        ))}
      </div>

      {/* Tips View */}
      {view === "tips" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {TIPS.map(({ icon, title, tip }) => (
            <div key={title} className="glass-card rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <p className="font-semibold text-[#F1F5F9]">{title}</p>
              </div>
              <p className="text-sm leading-relaxed text-[#94A3B8]">{tip}</p>
            </div>
          ))}
          <button onClick={() => setView("practice")}
            className="col-span-full flex items-center justify-center gap-2 rounded-xl bg-[#6366F1] py-3.5 font-semibold text-white hover:bg-[#4F46E5]">
            Practice Now <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Practice View */}
      {view === "practice" && (
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Context */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Speaking context</label>
              <div className="flex flex-wrap gap-2">
                {CONTEXTS.map((c) => (
                  <button key={c} type="button" onClick={() => setContext(c)}
                    className={clsx("rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                      context === c ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-[#1E293B] bg-[#111827] text-[#94A3B8] hover:border-amber-500/30")}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#94A3B8]">What do you want to improve?</label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <button key={g} type="button" onClick={() => setGoal(g)}
                    className={clsx("rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                      goal === g ? "border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]" : "border-[#1E293B] bg-[#111827] text-[#94A3B8] hover:border-[#6366F1]/30")}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Speech */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-[#94A3B8]">Your speech</label>
                <span className="text-xs text-[#94A3B8]/60">{speechText.length} characters</span>
              </div>
              <textarea rows={10} placeholder="Paste or write your speech here. It can be a full speech, an intro, or even just a rough draft — your coach will work with whatever you have."
                value={speechText} onChange={(e) => setSpeechText(e.target.value)}
                className="w-full resize-y rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/50 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]" />
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <button type="submit" disabled={speechText.trim().length < 30 || loading}
              className={clsx("flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-colors",
                speechText.trim().length >= 30 && !loading ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]" : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]")}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing your speech…</> : <><Send size={16} /> Get Coaching Feedback</>}
            </button>
          </form>

          {feedback && (
            <div id="coach-feedback" className="flex flex-col gap-4">
              {/* Summary */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-amber-400" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Coach Feedback</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-400">{feedback.overallScore as number}/10</span>
                </div>
                <p className="text-sm text-[#F1F5F9]">{feedback.summary as string}</p>
              </div>

              {/* 3 score areas */}
              {(["delivery", "structure", "persuasion"] as const).map((area) => {
                const data = feedback[area] as { score: number; feedback: string; tip: string };
                const colors: Record<string, string> = { delivery: "text-indigo-400", structure: "text-purple-400", persuasion: "text-emerald-400" };
                return (
                  <div key={area} className="glass-card rounded-2xl p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className={clsx("text-xs font-semibold uppercase tracking-wide capitalize", colors[area])}>{area}</p>
                      <span className={clsx("font-bold", colors[area])}>{data.score}/10</span>
                    </div>
                    <p className="mb-3 text-sm text-[#94A3B8]">{data.feedback}</p>
                    <div className="flex gap-2 rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                      <ArrowRight size={14} className="mt-0.5 shrink-0 text-[#6366F1]" />
                      <p className="text-xs text-[#F1F5F9]">{data.tip}</p>
                    </div>
                  </div>
                );
              })}

              {/* Rewrites */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="glass-card rounded-2xl p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Stronger Opening</p>
                  <p className="text-sm italic leading-relaxed text-[#94A3B8]">&ldquo;{feedback.openingHook as string}&rdquo;</p>
                </div>
                <div className="glass-card rounded-2xl p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Stronger Closing</p>
                  <p className="text-sm italic leading-relaxed text-[#94A3B8]">&ldquo;{feedback.closingLine as string}&rdquo;</p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-400">Power Phrase to Add</p>
                <p className="text-sm italic text-[#F1F5F9]">&ldquo;{feedback.powerPhrase as string}&rdquo;</p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[#1E293B] bg-[#111827] p-4">
                <Zap size={16} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                <div><p className="mb-0.5 text-xs font-semibold text-[#F59E0B]">Practice Exercise</p><p className="text-sm text-[#F1F5F9]">{feedback.practiceExercise as string}</p></div>
              </div>

              <button onClick={() => { setFeedback(null); setSpeechText(""); }} className="rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] hover:border-[#6366F1]/50">
                Try a New Speech
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
