"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Swords, ChevronDown, ChevronUp, Loader2, Send, ArrowRight, Lightbulb, Zap, Target, Shield, Clock, BookOpen, Mic } from "lucide-react";

const LESSONS = [
  {
    id: 1, icon: Swords, color: "bg-violet-500", title: "Turns — Flip Their Argument",
    concept: "A turn is when you take the opponent's argument and show it actually helps YOUR side. Instead of just saying 'you're wrong,' you say 'you're right, and that proves MY point.'",
    types: [
      { name: "Link Turn", desc: "Attack the connection between their argument and their conclusion." },
      { name: "Impact Turn", desc: "Agree with their evidence but flip the impact — their outcome is actually good for you." },
      { name: "Double Turn", desc: "Turn both the link AND the impact — be careful, this can backfire." },
    ],
    example: "They say: 'Social media spreads misinformation.' Turn: 'Social media EXPOSES misinformation faster than any previous medium — studies show false news gets debunked 6x faster online.'",
    takeaway: "Turns are the most powerful offensive move in debate. Always look for them first.",
  },
  {
    id: 2, icon: Shield, color: "bg-blue-500", title: "Offensive vs. Defensive Strategy",
    concept: "Defense keeps you from losing. Offense wins rounds. You need both — but know when to use each.",
    strategy: [
      { type: "Defensive", color: "text-blue-400", moves: ["Deny the link", "Minimize the impact", "Outweigh with your own evidence", "Permutation (in policy)"] },
      { type: "Offensive", color: "text-rose-400", moves: ["Run turns", "Extend your own impacts", "Go for your best argument in rebuttals", "Make your opponent's world worse than yours"] },
    ],
    takeaway: "In the last speech, offense beats defense. Winning on defense means you don't lose — winning on offense means you win.",
  },
  {
    id: 3, icon: BookOpen, color: "bg-indigo-500", title: "Reading the Flow",
    concept: "Winning on the flow means knowing which arguments are won, lost, or contested — and spending time on what matters most.",
    steps: [
      { step: "1. Identify dropped args", desc: "An unanswered argument is a conceded argument. Call it out." },
      { step: "2. Find your voting issue", desc: "Pick the 1-2 arguments you're clearly winning and extend them in your last speech." },
      { step: "3. Weigh impacts", desc: "Tell the judge WHY your impact is bigger: magnitude, probability, timeframe." },
      { step: "4. Collapse", desc: "Don't go for everything. Collapse to your strongest 2 arguments in the final speeches." },
    ],
    takeaway: "The debater who reads the flow best usually wins — even if their arguments aren't the strongest.",
  },
  {
    id: 4, icon: Target, color: "bg-amber-500", title: "Advanced Cross-Examination",
    concept: "Advanced cross-ex is about setting traps and extracting concessions you use in your next speech.",
    techniques: [
      { name: "The Concession Trap", desc: "Get them to agree to something small that destroys their larger argument." },
      { name: "The Definition Trap", desc: "Ask them to define key terms — then use their definition against them." },
      { name: "The Precedent Trap", desc: "Get them to agree to a principle, then apply it to your argument." },
      { name: "The Clarification Pivot", desc: "Ask for clarification that forces them to narrow their claim." },
    ],
    takeaway: "Always know what you're going to do with the answer before you ask the question.",
  },
  {
    id: 5, icon: BookOpen, color: "bg-teal-500", title: "Block Files",
    concept: "Block files are pre-written responses to common arguments. The best debaters prep blocks before the round so they're never caught off guard.",
    tips: [
      "Write blocks for every argument you expect to face",
      "Each block: label, 2-3 responses, evidence if needed",
      "Organize by argument type: topicality, counterplans, disadvantages, turns",
      "Review and update blocks after every round",
    ],
    takeaway: "Prep beats improvisation every time. The debater with better blocks almost always wins.",
  },
  {
    id: 6, icon: Clock, color: "bg-rose-500", title: "Time Allocation",
    concept: "You can't answer every argument equally — you have to choose where to spend your limited speaking time.",
    rules: [
      "Spend the most time on your strongest winning argument",
      "Extend dropped arguments briefly — they're already won",
      "Don't waste time on arguments you're losing — drop them",
      "Leave 30 seconds to frame why you win even if you lose some arguments",
    ],
    takeaway: "Time is your most valuable resource in a round. Spend it where it counts.",
  },
  {
    id: 7, icon: Swords, color: "bg-purple-500", title: "Running Off-Case Positions",
    concept: "Off-case arguments are positions you run against the AFF that are separate from their case — like disadvantages, counterplans, or kritiks.",
    positions: [
      { name: "Disadvantage (DA)", desc: "The AFF plan causes a bad thing to happen." },
      { name: "Counterplan (CP)", desc: "You offer a better solution than the AFF's plan." },
      { name: "Topicality (T)", desc: "The AFF's plan doesn't fit the resolution — procedural argument." },
    ],
    takeaway: "Off-case positions give you ground that doesn't depend on defeating the AFF case directly.",
  },
  {
    id: 8, icon: Mic, color: "bg-cyan-500", title: "Practice: Cross-Ex Exchange",
    concept: "Write a short argument on the topic below, then craft 3 cross-examination questions an opponent could use to trap you — and answer them as your opponent would.",
    tips: [
      "Think like your opponent when writing the questions",
      "Make the questions lead somewhere dangerous for your argument",
      "Your answers should show how you'd defend under pressure",
    ],
    takeaway: "The best way to improve your arguments is to attack them yourself first.",
  },
];

const TOPICS = [
  "The United States should ban TikTok",
  "Universal basic income should be implemented nationally",
  "Nuclear energy is key to solving climate change",
  "The death penalty should be abolished",
  "Affirmative action does more harm than good",
];

const SPEECH_TYPES = ["Constructive", "Rebuttal", "Summary", "Final Focus"];

export default function Level2() {
  const [tab, setTab] = useState<"learn" | "practice">("learn");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [speechType, setSpeechType] = useState(SPEECH_TYPES[0]);
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
      const res = await fetch("/api/debate/level-2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, speechType, speechText }),
      });
      if (!res.ok) throw new Error();
      setFeedback(await res.json());
      setTimeout(() => document.getElementById("l2-feedback")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-0.5 text-xs font-semibold text-violet-400">Level 2</span>
          <span className="rounded-full border border-[#1E293B] px-3 py-0.5 text-xs text-[#94A3B8]">Strategy</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">Debate Strategy</h1>
        <p className="text-[#94A3B8]">Think ahead, run turns, read the flow, and outmaneuver your opponent strategically.</p>
      </div>

      <div className="mb-8 flex gap-1 rounded-xl border border-[#1E293B] bg-[#111827] p-1">
        {(["learn", "practice"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx("flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold capitalize transition-colors",
              tab === t ? "bg-[#6366F1] text-white" : "text-[#94A3B8] hover:text-[#F1F5F9]")}>
            {t === "learn" ? <BookOpen size={14} /> : <Swords size={14} />}
            {t === "learn" ? "7 Lessons" : "Practice"}
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
                    {"types" in lesson && (
                      <div className="grid gap-2 sm:grid-cols-3">
                        {(lesson as typeof LESSONS[0] & { types: {name:string;desc:string}[] }).types.map((t) => (
                          <div key={t.name} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                            <p className="mb-1 text-sm font-semibold text-[#F1F5F9]">{t.name}</p>
                            <p className="text-xs text-[#94A3B8]">{t.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {"example" in lesson && (
                      <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
                        <p className="text-xs font-semibold text-violet-400 mb-1">Example Turn</p>
                        <p className="text-sm italic text-[#94A3B8]">{(lesson as {example:string}).example}</p>
                      </div>
                    )}
                    {"strategy" in lesson && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(lesson as {strategy:{type:string;color:string;moves:string[]}[]}).strategy.map((s) => (
                          <div key={s.type} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-4">
                            <p className={clsx("mb-2 font-bold text-sm", s.color)}>{s.type}</p>
                            {s.moves.map((m) => (
                              <div key={m} className="flex gap-2 mb-1">
                                <ArrowRight size={12} className="mt-0.5 shrink-0 text-[#94A3B8]" />
                                <p className="text-xs text-[#94A3B8]">{m}</p>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
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
                    {"techniques" in lesson && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(lesson as {techniques:{name:string;desc:string}[]}).techniques.map((t) => (
                          <div key={t.name} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                            <p className="mb-1 text-sm font-semibold text-[#F1F5F9]">{t.name}</p>
                            <p className="text-xs text-[#94A3B8]">{t.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {"tips" in lesson && (
                      <div className="flex flex-col gap-2">
                        {(lesson as {tips:string[]}).tips.map((tip, idx) => (
                          <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-[#6366F1]" /><p className="text-sm text-[#94A3B8]">{tip}</p></div>
                        ))}
                      </div>
                    )}
                    {"rules" in lesson && (
                      <div className="flex flex-col gap-2">
                        {(lesson as {rules:string[]}).rules.map((r, idx) => (
                          <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-[#6366F1]" /><p className="text-sm text-[#94A3B8]">{r}</p></div>
                        ))}
                      </div>
                    )}
                    {"positions" in lesson && (
                      <div className="flex flex-col gap-2">
                        {(lesson as {positions:{name:string;desc:string}[]}).positions.map((p) => (
                          <div key={p.name} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                            <p className="mb-0.5 text-sm font-semibold text-[#F1F5F9]">{p.name}</p>
                            <p className="text-xs text-[#94A3B8]">{p.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-3">
                      <div className="flex gap-2"><Lightbulb size={14} className="mt-0.5 shrink-0 text-[#6366F1]" /><p className="text-sm font-medium text-[#F1F5F9]">{lesson.takeaway}</p></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={() => setTab("practice")} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366F1] py-3.5 font-semibold text-white hover:bg-[#4F46E5]">
            Ready to practice <ArrowRight size={16} />
          </button>
        </div>
      )}

      {tab === "practice" && (
        <div className="flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Topic</label>
              <div className="mb-3 grid gap-2 sm:grid-cols-2">
                {TOPICS.map((t) => (
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
                      speechType === t ? "border-[#6366F1] bg-[#6366F1]/10 text-[#F1F5F9] ring-1 ring-[#6366F1]" : "border-[#1E293B] bg-[#111827] text-[#94A3B8]")}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Your Speech</label>
              <textarea rows={10} placeholder="Write your speech here. Include turns, strategic framing, and impact weighing..." value={speechText} onChange={(e) => setSpeechText(e.target.value)}
                className="w-full resize-y rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/50 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]" />
            </div>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button type="submit" disabled={speechText.trim().length < 30 || loading}
              className={clsx("flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-colors",
                speechText.trim().length >= 30 && !loading ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]" : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]")}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing strategy…</> : <><Send size={16} /> Get Strategic Feedback</>}
            </button>
          </form>

          {feedback && (
            <div id="l2-feedback" className="flex flex-col gap-4">
              <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-violet-400">Strategic Verdict</span>
                  <span className="text-2xl font-bold text-violet-400">{feedback.overallScore as number}/10</span>
                </div>
                <p className="text-sm text-[#F1F5F9]">{feedback.verdict as string}</p>
              </div>
              {[
                { key: "strategicStrengths", label: "Strategic Strengths", color: "text-emerald-400" },
                { key: "weaknesses", label: "Weaknesses the Opponent Exploits", color: "text-rose-400" },
                { key: "missedOpportunities", label: "Missed Opportunities", color: "text-amber-400" },
              ].map(({ key, label, color }) => (
                <div key={key} className="glass-card rounded-2xl p-5">
                  <p className={clsx("mb-3 text-xs font-semibold uppercase tracking-wide", color)}>{label}</p>
                  <div className="flex flex-col gap-2">
                    {(feedback[key] as string[]).map((item, i) => (
                      <div key={i} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-[#94A3B8]" /><p className="text-sm text-[#94A3B8]">{item}</p></div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="glass-card rounded-2xl p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-400">Flow Analysis</p>
                <p className="text-sm text-[#94A3B8]">{feedback.flowAnalysis as string}</p>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-400">Cross-Ex Trap Question</p>
                <p className="text-sm italic text-[#F1F5F9]">&ldquo;{feedback.challengeQuestion as string}&rdquo;</p>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Improved Version</p>
                <p className="text-sm italic leading-relaxed text-[#94A3B8]">&ldquo;{feedback.improvedVersion as string}&rdquo;</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#1E293B] bg-[#111827] p-4">
                <Zap size={16} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                <div><p className="mb-0.5 text-xs font-semibold text-[#F59E0B]">Next Drill</p><p className="text-sm text-[#F1F5F9]">{feedback.nextDrill as string}</p></div>
              </div>
              <button onClick={() => { setFeedback(null); setSpeechText(""); }} className="rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] hover:border-[#6366F1]/50 hover:text-[#F1F5F9]">
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
