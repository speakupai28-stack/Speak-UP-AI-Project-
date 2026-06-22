"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Trophy, ChevronDown, ChevronUp, Loader2, Send, ArrowRight, Lightbulb, Zap, AlertTriangle, CheckCircle2, XCircle, BookOpen, Mic } from "lucide-react";

const LESSONS = [
  {
    id: 1, icon: Trophy, color: "bg-amber-500", title: "Tournament Structure",
    concept: "Understanding the bracket is essential for pacing your prep and energy across a tournament.",
    content: [
      { label: "Prelims", desc: "Usually 4-6 rounds to establish your record. Win more than you lose to break." },
      { label: "Break Rounds", desc: "Octos, Quarters, Semis, Finals. Each round is elimination — one loss ends your run." },
      { label: "Power Matching", desc: "After Round 2, you're paired against teams with the same record. Difficulty increases." },
      { label: "Speaker Points", desc: "Used as a tiebreaker. Every round counts even when you lose." },
    ],
    takeaway: "Treat every prelim round like an elim. Judges talk — your reputation follows you through the bracket.",
  },
  {
    id: 2, icon: BookOpen, color: "bg-indigo-500", title: "Judge Adaptation",
    concept: "Reading your judge's paradigm and adjusting your style is a skill top debaters develop obsessively.",
    paradigms: [
      { type: "Flow Judge", icon: "📋", adjustments: "Go for technical arguments, extend dropped args, don't repeat yourself, collapse to 2 issues." },
      { type: "Lay Judge", icon: "👤", adjustments: "Slow down, tell a clear story, avoid jargon, explain your impacts simply, be likeable." },
      { type: "Progressive Judge", icon: "⚡", adjustments: "Theory and Ks are acceptable, meta-theory possible, speed is fine, creative arguments rewarded." },
      { type: "Policy Judge", icon: "📁", adjustments: "Off-case positions expected, linearity matters, evidence quality crucial, CPs and DAs central." },
    ],
    takeaway: "Read the paradigm 20 minutes before your round. Adapt your strategy — not your arguments.",
  },
  {
    id: 3, icon: AlertTriangle, color: "bg-rose-500", title: "Theory & Procedurals",
    concept: "Theory arguments challenge whether your opponent's debate practices are fair or educational — not whether their argument is right.",
    arguments: [
      { name: "Topicality (T)", desc: "Their plan doesn't fit within the resolution. Run this when you think AFF is out of bounds." },
      { name: "Conditionality Bad", desc: "NEG can't run contradictory positions. Run this when NEG kicks a counterplan mid-round." },
      { name: "Spec Arguments", desc: "AFF hasn't specified enough about their plan implementation." },
    ],
    structure: "Shell → Violation → Standards → Voters (Education/Fairness)",
    takeaway: "Theory is a tool, not a weapon. Run it when you genuinely have a fairness violation — not just to waste time.",
  },
  {
    id: 4, icon: BookOpen, color: "bg-purple-500", title: "Kritik Debate (K Debate)",
    concept: "A Kritik challenges the philosophical assumptions behind the resolution or the opponent's advocacy — not just their policy.",
    parts: [
      { name: "Link", desc: "How does the AFF's advocacy connect to the harm you're identifying?" },
      { name: "Impact", desc: "What bad thing happens because of that link? (Often systemic harms)" },
      { name: "Alternative", desc: "What do you do instead? Reject the AFF? Embrace a different framework?" },
      { name: "Framework", desc: "Why should the judge evaluate the debate through your K's lens?" },
    ],
    takeaway: "Ks are high-reward, high-risk. Only run them if you understand the philosophy deeply enough to defend it under cross-ex.",
  },
  {
    id: 5, icon: Mic, color: "bg-teal-500", title: "Speed & Clarity",
    concept: "Speed (spreading) is a tool — use it strategically, not constantly.",
    rules: [
      "Tag-team evidence with your partner before increasing speed",
      "Slow down for your most important arguments — judges flow what they understand",
      "Ask about speed preferences before the round starts",
      "If a judge raises their hand during your speech — slow down immediately",
      "Clarity beats speed in close rounds",
    ],
    takeaway: "The best debaters speak at exactly the speed their judge can flow. Not one word per minute faster.",
  },
  {
    id: 6, icon: AlertTriangle, color: "bg-rose-600", title: "Elimination Round Pressure",
    concept: "Elim rounds feel different — the nerves are real and they affect your performance if you're not prepared.",
    strategies: [
      "Do your prep the night before — don't try to write new blocks the morning of",
      "Get 8 hours of sleep. Tired debaters make strategic mistakes.",
      "Before the round: review your best arguments, not your worst",
      "In round: stick to your game plan. Nerves make you second-guess — don't.",
      "If you're losing: find your 1 best argument and collapse to it hard",
    ],
    takeaway: "Pressure is the filter that shows who prepared. Prepare more than anyone else in the bracket.",
  },
  {
    id: 7, icon: BookOpen, color: "bg-cyan-500", title: "Post-Round Analysis",
    concept: "What you do AFTER a round determines how fast you improve before the next one.",
    steps: [
      { step: "1. Write it down immediately", desc: "What arguments were run? What was your response? What did the judge say?" },
      { step: "2. Identify the turning point", desc: "What was the moment you won or lost the round?" },
      { step: "3. Write a new block", desc: "For every argument that caught you off guard, prep a response before your next round." },
      { step: "4. Talk to the judge", desc: "Most judges will give feedback — use it. Ask: 'What was your voting issue?'" },
    ],
    takeaway: "The round isn't over when the judge decides. It's over when you've extracted every lesson from it.",
  },
  {
    id: 8, icon: Trophy, color: "bg-amber-600", title: "Practice: Full Round Simulation",
    concept: "Write a complete final focus or last rebuttal speech on the topic below. This is elimination pressure — your judge paradigm matters.",
    tips: [
      "Pick your 2 best winning arguments and extend only those",
      "Weigh your impacts explicitly: magnitude, probability, timeframe",
      "Address your opponent's best argument — don't ignore it",
      "End with a clear, powerful voter statement",
    ],
    takeaway: "In elimination rounds, the debater who knows exactly why they win — and says it clearly — wins.",
  },
];

const TOPICS = [
  "The benefits of space exploration outweigh the costs",
  "The US should adopt a carbon tax",
  "Colleges should eliminate legacy admissions",
  "The UN Security Council veto should be abolished",
  "Developed nations owe reparations for colonialism",
];

const SPEECH_TYPES = ["Last Rebuttal", "Final Focus", "2NR", "2AR"];
const JUDGE_PARADIGMS = ["Flow Judge", "Lay Judge", "Progressive Judge", "Policy Judge"];

export default function Level3() {
  const [tab, setTab] = useState<"learn" | "practice">("learn");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [speechType, setSpeechType] = useState(SPEECH_TYPES[0]);
  const [judgeParadigm, setJudgeParadigm] = useState(JUDGE_PARADIGMS[0]);
  const [speechText, setSpeechText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openLesson, setOpenLesson] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (speechText.trim().length < 30) return;
    setLoading(true); setFeedback(null); setError(null);
    try {
      const res = await fetch("/api/debate/level-3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, speechType, speechText, judgeParadigm }),
      });
      if (!res.ok) throw new Error();
      setFeedback(await res.json());
      setTimeout(() => document.getElementById("l3-feedback")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400">Level 3</span>
          <span className="rounded-full border border-[#1E293B] px-3 py-0.5 text-xs text-[#94A3B8]">Competition</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">Competition Debate</h1>
        <p className="text-[#94A3B8]">Tournament prep, judge adaptation, and elite-level technical debate. Brutally honest feedback only.</p>
      </div>

      <div className="mb-8 flex gap-1 rounded-xl border border-[#1E293B] bg-[#111827] p-1">
        {(["learn", "practice"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx("flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold capitalize transition-colors",
              tab === t ? "bg-[#6366F1] text-white" : "text-[#94A3B8] hover:text-[#F1F5F9]")}>
            {t === "learn" ? <BookOpen size={14} /> : <Trophy size={14} />}
            {t === "learn" ? "7 Lessons" : "Round Sim"}
          </button>
        ))}
      </div>

      {tab === "learn" && (
        <div className="flex flex-col gap-3">
          {LESSONS.map((lesson, i) => {
            const Icon = lesson.icon;
            const open = openLesson === i;
            return (
              <div key={lesson.id} className="glass-card overflow-hidden rounded-2xl">
                <button onClick={() => setOpenLesson(open ? -1 : i)} className="flex w-full items-center gap-4 p-5 text-left">
                  <div className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", lesson.color)}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-[#94A3B8]">Lesson {lesson.id}</span>
                    <p className="font-semibold text-[#F1F5F9]">{lesson.title}</p>
                  </div>
                  {open ? <ChevronUp size={16} className="shrink-0 text-[#94A3B8]" /> : <ChevronDown size={16} className="shrink-0 text-[#94A3B8]" />}
                </button>
                {open && (
                  <div className="border-t border-[#1E293B] px-5 pb-5 pt-4 space-y-4">
                    <p className="text-sm leading-relaxed text-[#94A3B8]">{lesson.concept}</p>
                    {"content" in lesson && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(lesson as {content:{label:string;desc:string}[]}).content.map((c) => (
                          <div key={c.label} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                            <p className="mb-1 text-sm font-semibold text-[#F1F5F9]">{c.label}</p>
                            <p className="text-xs text-[#94A3B8]">{c.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {"paradigms" in lesson && (
                      <div className="flex flex-col gap-2">
                        {(lesson as {paradigms:{type:string;icon:string;adjustments:string}[]}).paradigms.map((p) => (
                          <div key={p.type} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                            <p className="mb-1 text-sm font-semibold text-[#F1F5F9]">{p.icon} {p.type}</p>
                            <p className="text-xs text-[#94A3B8]">{p.adjustments}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {"arguments" in lesson && (
                      <div className="flex flex-col gap-2">
                        {(lesson as {arguments:{name:string;desc:string}[]}).arguments.map((a) => (
                          <div key={a.name} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                            <p className="mb-1 text-sm font-semibold text-[#F1F5F9]">{a.name}</p>
                            <p className="text-xs text-[#94A3B8]">{a.desc}</p>
                          </div>
                        ))}
                        {"structure" in lesson && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3"><p className="text-xs font-semibold text-rose-400">Structure: {(lesson as {structure:string}).structure}</p></div>}
                      </div>
                    )}
                    {"parts" in lesson && (
                      <div className="flex flex-col gap-2">
                        {(lesson as {parts:{name:string;desc:string}[]}).parts.map((p, idx) => (
                          <div key={idx} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/20 text-xs font-bold text-[#6366F1]">{idx+1}</span>
                            <div><p className="text-sm font-semibold text-[#F1F5F9]">{p.name}</p><p className="text-xs text-[#94A3B8]">{p.desc}</p></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {"rules" in lesson && (lesson as {rules:string[]}).rules.map((r, idx) => (
                      <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-[#6366F1]" /><p className="text-sm text-[#94A3B8]">{r}</p></div>
                    ))}
                    {"strategies" in lesson && (lesson as {strategies:string[]}).strategies.map((s, idx) => (
                      <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-[#6366F1]" /><p className="text-sm text-[#94A3B8]">{s}</p></div>
                    ))}
                    {"steps" in lesson && (
                      <div className="flex flex-col gap-3">
                        {(lesson as {steps:{step:string;desc:string}[]}).steps.map((s, idx) => (
                          <div key={idx} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/20 text-xs font-bold text-[#6366F1]">{idx+1}</span>
                            <div><p className="text-sm font-semibold text-[#F1F5F9]">{s.step}</p><p className="text-xs text-[#94A3B8]">{s.desc}</p></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {"tips" in lesson && (lesson as {tips:string[]}).tips.map((tip, idx) => (
                      <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-[#6366F1]" /><p className="text-sm text-[#94A3B8]">{tip}</p></div>
                    ))}
                    <div className="rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-3">
                      <div className="flex gap-2"><Lightbulb size={14} className="mt-0.5 shrink-0 text-[#6366F1]" /><p className="text-sm font-medium text-[#F1F5F9]">{lesson.takeaway}</p></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={() => setTab("practice")} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366F1] py-3.5 font-semibold text-white hover:bg-[#4F46E5]">
            Enter the round <ArrowRight size={16} />
          </button>
        </div>
      )}

      {tab === "practice" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
            <p className="text-xs font-semibold text-rose-400">Elite-level feedback. No sugarcoating.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Topic</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {TOPICS.map((t) => (
                  <button key={t} type="button" onClick={() => setTopic(t)}
                    className={clsx("rounded-xl border px-4 py-2.5 text-left text-sm transition-all",
                      topic === t ? "border-[#6366F1] bg-[#6366F1]/10 text-[#F1F5F9] ring-1 ring-[#6366F1]" : "border-[#1E293B] bg-[#111827] text-[#94A3B8] hover:border-[#6366F1]/50")}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Speech Type</label>
                <div className="flex flex-col gap-2">
                  {SPEECH_TYPES.map((t) => (
                    <button key={t} type="button" onClick={() => setSpeechType(t)}
                      className={clsx("rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                        speechType === t ? "border-[#6366F1] bg-[#6366F1]/10 text-[#F1F5F9]" : "border-[#1E293B] bg-[#111827] text-[#94A3B8]")}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Judge Paradigm</label>
                <div className="flex flex-col gap-2">
                  {JUDGE_PARADIGMS.map((j) => (
                    <button key={j} type="button" onClick={() => setJudgeParadigm(j)}
                      className={clsx("rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                        judgeParadigm === j ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-[#1E293B] bg-[#111827] text-[#94A3B8]")}>
                      {j}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Your Speech</label>
              <textarea rows={10} placeholder="Write your final speech. Collapse to your 2 best arguments. Weigh impacts explicitly. Make it count." value={speechText} onChange={(e) => setSpeechText(e.target.value)}
                className="w-full resize-y rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/50 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]" />
            </div>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button type="submit" disabled={speechText.trim().length < 30 || loading}
              className={clsx("flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-colors",
                speechText.trim().length >= 30 && !loading ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]" : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]")}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Judging your round…</> : <><Send size={16} /> Submit for Elite Feedback</>}
            </button>
          </form>

          {feedback && (
            <div id="l3-feedback" className="flex flex-col gap-4">
              <div className={clsx("rounded-2xl border p-5", feedback.tournamentReady ? "border-emerald-500/30 bg-emerald-500/10" : "border-rose-500/30 bg-rose-500/10")}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {feedback.tournamentReady ? <CheckCircle2 size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-rose-400" />}
                    <span className={clsx("text-xs font-semibold uppercase", feedback.tournamentReady ? "text-emerald-400" : "text-rose-400")}>
                      {feedback.tournamentReady ? "Tournament Ready" : "Not Tournament Ready"}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-[#F1F5F9]">{feedback.overallScore as number}/10</span>
                </div>
                <p className="text-sm text-[#F1F5F9]">{feedback.roundVerdict as string}</p>
              </div>
              {[
                { key: "technicalBreakdown", label: "Technical Breakdown" },
                { key: "judgeAdaptation", label: "Judge Adaptation" },
                { key: "eliteLevel", label: "What Separates This from Finals Level" },
                { key: "speedClarity", label: "Speed & Clarity" },
              ].map(({ key, label }) => (
                <div key={key} className="glass-card rounded-2xl p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p>
                  <p className="text-sm leading-relaxed text-[#94A3B8]">{feedback[key] as string}</p>
                </div>
              ))}
              <div className="glass-card rounded-2xl p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-rose-400">Critical Drops</p>
                <div className="flex flex-col gap-2">
                  {(feedback.criticalDrops as string[]).map((drop, i) => (
                    <div key={i} className="flex gap-2"><XCircle size={13} className="mt-0.5 shrink-0 text-rose-400" /><p className="text-sm text-[#94A3B8]">{drop}</p></div>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-400">Pressure Points</p>
                <p className="text-sm text-[#94A3B8]">{feedback.pressurePoints as string}</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <Zap size={16} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                <div><p className="mb-0.5 text-xs font-semibold text-[#F59E0B]">Fix Before Your Next Elim</p><p className="text-sm text-[#F1F5F9]">{feedback.elimRoundFix as string}</p></div>
              </div>
              <button onClick={() => { setFeedback(null); setSpeechText(""); }} className="rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] hover:border-[#6366F1]/50">Try Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
