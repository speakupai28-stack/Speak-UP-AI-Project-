"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Users, ChevronDown, ChevronUp, ArrowRight, Lightbulb, Loader2, Send, Zap } from "lucide-react";
import { FeedbackSkeleton } from "@/components/ui/FeedbackSkeleton";
import { ScoreReveal } from "@/components/motion/ScoreReveal";
import type { CommitteeSpeechFeedback } from "@/lib/types";

const ANALYZING_MESSAGES = [
  "Reading your speech…",
  "Checking your country's real position…",
  "Reviewing structure and diplomatic language…",
  "Writing your coach feedback…",
];

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
  const [feedback, setFeedback] = useState<CommitteeSpeechFeedback | null>(null);
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
      const data: CommitteeSpeechFeedback = await res.json();
      setFeedback(data);
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full border border-maroon/30 bg-maroon/10 px-3 py-0.5 text-xs font-semibold text-maroon">Section 2</span>
          <span className="rounded-full border border-ink/10 px-3 py-0.5 text-xs text-ink-soft">Committee Work</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-ink">Committee Work & Speeches</h1>
        <p className="text-ink-soft">Deliver powerful speeches, lobby effectively, and draft winning resolutions.</p>
      </div>

      <div className="mb-8 flex gap-1 rounded-md border border-ink/10 bg-paper-dim p-1">
        {(["learn", "practice"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx("flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold capitalize transition-colors",
              tab === t ? "bg-maroon text-paper" : "text-ink-soft hover:text-ink")}>
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
              <div key={lesson.id} className="glass-card overflow-hidden rounded-lg">
                <button onClick={() => setOpenLesson(open ? -1 : i)} className="flex w-full items-center gap-4 p-5 text-left">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-maroon/10">
                    <Users size={16} className="text-maroon" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-ink-soft">Lesson {lesson.id}</span>
                    <p className="font-semibold text-ink">{lesson.title}</p>
                  </div>
                  {open ? <ChevronUp size={16} className="shrink-0 text-ink-soft" /> : <ChevronDown size={16} className="shrink-0 text-ink-soft" />}
                </button>
                {open && (
                  <div className="border-t border-ink/10 px-5 pb-5 pt-4 space-y-4">
                    <p className="text-sm leading-relaxed text-ink-soft">{lesson.concept}</p>
                    {"structure" in lesson && (
                      <div className="flex flex-col gap-2">
                        {(lesson as {structure:{part:string;desc:string}[]}).structure.map((s) => (
                          <div key={s.part} className="rounded-md border border-ink/10 bg-paper-dim p-3">
                            <p className="mb-0.5 text-sm font-semibold text-maroon">{s.part}</p>
                            <p className="text-xs text-ink-soft">{s.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {"tips" in lesson && (lesson as {tips:string[]}).tips.map((tip, idx) => (
                      <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-maroon" /><p className="text-sm text-ink-soft">{tip}</p></div>
                    ))}
                    {"elements" in lesson && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(lesson as {elements:{name:string;desc:string}[]}).elements.map((el) => (
                          <div key={el.name} className="rounded-md border border-ink/10 bg-paper-dim p-3">
                            <p className="mb-0.5 text-sm font-semibold text-ink">{el.name}</p>
                            <p className="text-xs text-ink-soft">{el.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {"types" in lesson && (
                      <div className="flex flex-col gap-2">
                        {(lesson as {types:{name:string;desc:string}[]}).types.map((t) => (
                          <div key={t.name} className="rounded-md border border-ink/10 bg-paper-dim p-3">
                            <p className="mb-0.5 text-sm font-semibold text-ink">{t.name}</p>
                            <p className="text-xs text-ink-soft">{t.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {"process" in lesson && (lesson as {process:string[]}).process.map((p, idx) => (
                      <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-maroon" /><p className="text-sm text-ink-soft">{p}</p></div>
                    ))}
                    <div className="rounded-md border border-maroon/30 bg-maroon/10 px-4 py-3">
                      <div className="flex gap-2"><Lightbulb size={14} className="mt-0.5 shrink-0 text-maroon" /><p className="text-sm font-medium text-ink">{lesson.takeaway}</p></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={() => setTab("practice")} className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-maroon py-3.5 font-semibold text-paper hover:bg-maroon-dark">
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
                  speechContext === c ? "border-maroon/50 bg-maroon/10 text-maroon" : "border-ink/10 bg-paper-dim text-ink-soft")}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="mun-country" className="mb-2 block text-sm font-medium text-ink-soft">Your Country</label>
              <input id="mun-country" type="text" placeholder="e.g. France, Brazil..." value={country} onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-sm text-ink placeholder-stone/60 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon" />
            </div>
            <div>
              <label htmlFor="mun-topic" className="mb-2 block text-sm font-medium text-ink-soft">Topic</label>
              <input id="mun-topic" type="text" placeholder="e.g. Climate change, Sudan crisis..." value={topic} onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-sm text-ink placeholder-stone/60 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon" />
            </div>
          </div>
          <div>
            <label htmlFor="mun-speech" className="mb-2 block text-sm font-medium text-ink-soft">Your Speech</label>
            <textarea id="mun-speech" rows={8} placeholder="Write your MUN speech here..." value={speechText} onChange={(e) => setSpeechText(e.target.value)}
              className="w-full resize-y rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-sm text-ink placeholder-stone/50 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon" />
          </div>
          {error && <p className="text-sm text-maroon">{error}</p>}
          <button type="submit" disabled={!speechText.trim() || !country.trim() || !topic.trim() || loading}
            className={clsx("flex items-center justify-center gap-2 rounded-md py-3.5 font-semibold transition-colors",
              speechText.trim() && country.trim() && topic.trim() && !loading ? "bg-maroon text-paper hover:bg-maroon-dark" : "cursor-not-allowed bg-ink/10 text-ink-soft")}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</> : <><Send size={16} /> Get Speech Feedback</>}
          </button>

          {loading && <FeedbackSkeleton messages={ANALYZING_MESSAGES} rows={5} />}
        </form>
      )}

      {tab === "practice" && feedback && !loading && (
        <ScoreReveal revealKey={feedback.overallScore} className="mt-5 flex flex-col gap-4">
          <div className="rounded-lg border border-maroon/30 bg-maroon/10 p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-maroon">
                <Zap size={14} /> Coach Feedback
              </span>
              <span className="text-2xl font-bold text-ink">{feedback.overallScore}/10</span>
            </div>
            <p className="text-sm text-ink">{feedback.summary}</p>
          </div>

          <div className="glass-card rounded-lg p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Country Representation</p>
            <p className="text-sm leading-relaxed text-ink-soft">{feedback.countryRepresentation}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-lg p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Speech Structure</p>
              <p className="text-sm leading-relaxed text-ink-soft">{feedback.speechStructure}</p>
            </div>
            <div className="glass-card rounded-lg p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Diplomatic Language</p>
              <p className="text-sm leading-relaxed text-ink-soft">{feedback.diplomaticLanguage}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-lg p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-forest">Strengths</p>
              <div className="flex flex-col gap-1.5">
                {feedback.strengths.map((s, i) => (
                  <div key={i} className="flex gap-2"><ArrowRight size={13} className="mt-0.5 shrink-0 text-forest" /><p className="text-sm text-ink-soft">{s}</p></div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-lg p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8a6b28]">Improvements</p>
              <div className="flex flex-col gap-1.5">
                {feedback.improvements.map((imp, i) => (
                  <div key={i} className="flex gap-2"><ArrowRight size={13} className="mt-0.5 shrink-0 text-[#8a6b28]" /><p className="text-sm text-ink-soft">{imp}</p></div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-lg p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-maroon">Stronger Opening Sentence</p>
            <p className="text-sm italic leading-relaxed text-ink-soft">&ldquo;{feedback.improvedOpeningSentence}&rdquo;</p>
          </div>

          <div className="glass-card rounded-lg p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-maroon">Suggested Operative Clause</p>
            <p className="text-sm italic leading-relaxed text-ink-soft">&ldquo;{feedback.suggestedOperativeClause}&rdquo;</p>
          </div>

          <div className="flex items-start gap-3 rounded-md border border-ink/10 bg-paper-dim p-4">
            <Zap size={14} className="mt-0.5 shrink-0 text-[#8a6b28]" />
            <div>
              <p className="text-xs font-semibold text-[#8a6b28]">Next Step</p>
              <p className="text-sm text-ink">{feedback.nextStep}</p>
            </div>
          </div>

          <button
            onClick={() => { setFeedback(null); setSpeechText(""); }}
            className="rounded-md border border-ink/10 py-3 text-sm font-medium text-ink-soft transition-colors hover:border-maroon/50 hover:text-ink"
          >
            Try Another Speech
          </button>
        </ScoreReveal>
      )}
    </div>
  );
}
