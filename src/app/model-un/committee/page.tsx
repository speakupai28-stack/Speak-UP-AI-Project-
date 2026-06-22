"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Users, ChevronDown, ChevronUp, ArrowRight, Lightbulb, Loader2, Send, Zap } from "lucide-react";

const LESSONS = [
  {
    id: 1, title: "Delivering an Opening Speech",
    concept: "Your opening speech sets the tone for how other delegates perceive you. It must clearly state your country's position on the topic.",
    structure: [
      { part: "Hook (10 sec)", desc: "A powerful statistic, quote, or statement that grabs attention." },
      { part: "Country Position (30 sec)", desc: "Where does your country stand and why? Be direct." },
      { part: "Evidence (45 sec)", desc: "What has your country done? What does the data show?" },
      { part: "Proposed Solutions (30 sec)", desc: "What should the committee do? Preview your resolution ideas." },
      { part: "Strong Close (5 sec)", desc: "End with confidence, not trailing off." },
    ],
    takeaway: "Delegates remember the first and last 10 seconds of every speech. Make them count.",
  },
  {
    id: 2, title: "Lobbying and Forming Blocs",
    concept: "Lobbying is the informal diplomacy that happens outside formal debate — it's where resolutions are actually built.",
    tips: [
      "Identify countries with similar positions before the conference",
      "Approach allies early — don't wait until working paper time",
      "Know your red lines: what you will and won't compromise on",
      "Be the delegate who connects groups — bridges win more than hardliners",
      "In unmoderated caucuses, move around the room and talk to everyone",
    ],
    takeaway: "The best resolutions are built before formal debate begins. Lobby early and often.",
  },
  {
    id: 3, title: "Writing Working Papers",
    concept: "A working paper is an informal draft resolution that your bloc writes collaboratively. It becomes a draft resolution when formally introduced.",
    elements: [
      { name: "Sponsors", desc: "Countries who wrote and strongly support the paper (their names go first)" },
      { name: "Signatories", desc: "Countries who want it debated but don't fully endorse it yet" },
      { name: "Preambulatory Clauses", desc: "Starting with: Noting, Recognizing, Recalling, Deeply Concerned..." },
      { name: "Operative Clauses", desc: "Starting with: Urges, Calls Upon, Encourages, Requests, Demands..." },
    ],
    takeaway: "Write operative clauses that are specific enough to mean something but broad enough to attract signatories.",
  },
  {
    id: 4, title: "Points of Information & Debate",
    concept: "During formal debate, you can engage with other delegates through points and questions.",
    types: [
      { name: "Point of Information", desc: "Ask a question after another delegate's speech (if they yield to questions)." },
      { name: "Point of Order", desc: "Raise a procedural error — only about the process, never the content." },
      { name: "Point of Personal Privilege", desc: "Request something for your comfort (can't hear, need a break)." },
      { name: "Moderated Caucus", desc: "Structured discussion where chair calls on delegates for short speeches." },
      { name: "Unmoderated Caucus", desc: "Informal time for lobbying and working paper writing." },
    ],
    takeaway: "Use points sparingly and purposefully — frequent interruptions can frustrate a committee.",
  },
  {
    id: 5, title: "Voting and Amendments",
    concept: "Voting is when the committee formally decides on draft resolutions. Amendments can change the text before final voting.",
    process: [
      "Motion to move into voting procedure (requires majority support)",
      "No new debate during voting — delegates only vote",
      "Amendment sponsors can propose changes to operative clauses",
      "Friendly amendments (sponsors agree): automatically accepted",
      "Unfriendly amendments (sponsors disagree): require a vote",
    ],
    takeaway: "Know who has the votes before you push a resolution to a vote. Losing in committee is demoralizing.",
  },
];

const SPEECH_CONTEXTS = ["Opening Speech", "Working Paper Introduction", "Amendment Speech", "Closing Statement"];

export default function ModelUNCommittee() {
  const [openLesson, setOpenLesson] = useState(0);
  const [tab, setTab] = useState<"learn" | "practice">("learn");
  const [speechContext, setSpeechContext] = useState(SPEECH_CONTEXTS[0]);
  const [country, setCountry] = useState("");
  const [topic, setTopic] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!speechText.trim() || !country.trim() || !topic.trim()) return;
    setLoading(true); setError(null); setFeedback(null);
    try {
      const res = await fetch("/api/model-un/committee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speechContext, country, topic, speechText }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFeedback(JSON.stringify(data));
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-0.5 text-xs font-semibold text-blue-400">Section 2</span>
          <span className="rounded-full border border-[#1E293B] px-3 py-0.5 text-xs text-[#94A3B8]">Committee Work</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">Committee Work & Speeches</h1>
        <p className="text-[#94A3B8]">Deliver powerful speeches, lobby effectively, and draft winning resolutions.</p>
      </div>

      <div className="mb-8 flex gap-1 rounded-xl border border-[#1E293B] bg-[#111827] p-1">
        {(["learn", "practice"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx("flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold capitalize transition-colors",
              tab === t ? "bg-[#6366F1] text-white" : "text-[#94A3B8] hover:text-[#F1F5F9]")}>
            {t === "learn" ? <Users size={14} /> : <Send size={14} />}
            {t === "learn" ? "5 Lessons" : "Practice Speech"}
          </button>
        ))}
      </div>

      {tab === "learn" && (
        <div className="flex flex-col gap-3">
          {LESSONS.map((lesson, i) => {
            const open = openLesson === i;
            return (
              <div key={lesson.id} className="glass-card overflow-hidden rounded-2xl">
                <button onClick={() => setOpenLesson(open ? -1 : i)} className="flex w-full items-center gap-4 p-5 text-left">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500">
                    <Users size={16} className="text-white" />
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
                    {"structure" in lesson && (
                      <div className="flex flex-col gap-2">
                        {(lesson as {structure:{part:string;desc:string}[]}).structure.map((s) => (
                          <div key={s.part} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                            <p className="mb-0.5 text-sm font-semibold text-blue-400">{s.part}</p>
                            <p className="text-xs text-[#94A3B8]">{s.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {"tips" in lesson && (lesson as {tips:string[]}).tips.map((tip, idx) => (
                      <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-blue-400" /><p className="text-sm text-[#94A3B8]">{tip}</p></div>
                    ))}
                    {"elements" in lesson && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(lesson as {elements:{name:string;desc:string}[]}).elements.map((el) => (
                          <div key={el.name} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                            <p className="mb-0.5 text-sm font-semibold text-[#F1F5F9]">{el.name}</p>
                            <p className="text-xs text-[#94A3B8]">{el.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {"types" in lesson && (
                      <div className="flex flex-col gap-2">
                        {(lesson as {types:{name:string;desc:string}[]}).types.map((t) => (
                          <div key={t.name} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                            <p className="mb-0.5 text-sm font-semibold text-[#F1F5F9]">{t.name}</p>
                            <p className="text-xs text-[#94A3B8]">{t.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {"process" in lesson && (lesson as {process:string[]}).process.map((p, idx) => (
                      <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-blue-400" /><p className="text-sm text-[#94A3B8]">{p}</p></div>
                    ))}
                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3">
                      <div className="flex gap-2"><Lightbulb size={14} className="mt-0.5 shrink-0 text-blue-400" /><p className="text-sm font-medium text-[#F1F5F9]">{lesson.takeaway}</p></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={() => setTab("practice")} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366F1] py-3.5 font-semibold text-white hover:bg-[#4F46E5]">
            Practice a Speech <ArrowRight size={16} />
          </button>
        </div>
      )}

      {tab === "practice" && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            {SPEECH_CONTEXTS.map((c) => (
              <button key={c} type="button" onClick={() => setSpeechContext(c)}
                className={clsx("rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  speechContext === c ? "border-blue-500/50 bg-blue-500/10 text-blue-400" : "border-[#1E293B] bg-[#111827] text-[#94A3B8]")}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Your Country</label>
              <input type="text" placeholder="e.g. France, Brazil..." value={country} onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Topic</label>
              <input type="text" placeholder="e.g. Climate change, Sudan crisis..." value={topic} onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Your Speech</label>
            <textarea rows={8} placeholder="Write your MUN speech here..." value={speechText} onChange={(e) => setSpeechText(e.target.value)}
              className="w-full resize-y rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/50 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]" />
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button type="submit" disabled={!speechText.trim() || !country.trim() || !topic.trim() || loading}
            className={clsx("flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-colors",
              speechText.trim() && country.trim() && topic.trim() && !loading ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]" : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]")}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</> : <><Send size={16} /> Get Speech Feedback</>}
          </button>
          {feedback && (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
              <div className="flex items-center gap-2 mb-3"><Zap size={14} className="text-blue-400" /><span className="text-xs font-semibold uppercase text-blue-400">Coach Feedback</span></div>
              <pre className="text-sm text-[#94A3B8] whitespace-pre-wrap">{feedback}</pre>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
