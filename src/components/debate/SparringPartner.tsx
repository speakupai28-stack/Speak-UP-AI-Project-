"use client";

import { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { Loader2, Send, Swords, RefreshCw, Gavel } from "lucide-react";
import { getProgress, recordSession } from "@/lib/progress";
import type { SparringMessage, JudgeBallot } from "@/lib/types";

const MOTIONS_BY_LEVEL: Record<number, string[]> = {
  1: ["Social media does more harm than good", "Schools should have a 4-day week", "Homework should be abolished"],
  2: ["Universal basic income should be implemented", "Nuclear energy is key to solving climate change", "The death penalty should be abolished"],
  3: ["The UN Security Council veto should be abolished", "Developed nations owe climate refugees legal protection", "Algorithmic content moderation threatens free speech"],
};

interface SparringPartnerProps {
  level?: number;
}

export default function SparringPartner({ level: propLevel }: SparringPartnerProps) {
  const [level, setLevel] = useState(propLevel ?? 1);
  const [motion, setMotion] = useState("");
  const [studentSide, setStudentSide] = useState<"Proposition" | "Opposition">("Proposition");
  const [messages, setMessages] = useState<SparringMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"setup" | "debate" | "judging" | "done">("setup");
  const [ballot, setBallot] = useState<JudgeBallot | null>(null);
  const [speechCount, setSpeechCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = getProgress();
    setLevel(propLevel ?? p.level);
    const motions = MOTIONS_BY_LEVEL[p.level ?? 1];
    setMotion(motions?.[0] ?? "");
  }, [propLevel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startDebate() {
    setPhase("debate");
    setLoading(true);
    try {
      const res = await fetch("/api/debate/sparring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motion, studentSide, messages: [], level }),
      });
      const data = await res.json();
      setMessages([{ role: "opponent", content: data.response }]);
    } catch {}
    finally { setLoading(false); }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: SparringMessage = { role: "student", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setSpeechCount((c) => c + 1);
    setLoading(true);

    try {
      const res = await fetch("/api/debate/sparring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motion, studentSide, messages: newMessages, level }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "opponent", content: data.response }]);
    } catch {}
    finally { setLoading(false); }
  }

  async function requestJudge() {
    setPhase("judging");
    setLoading(true);
    try {
      const propSpeeches = messages.filter((m) =>
        (studentSide === "Proposition" && m.role === "student") ||
        (studentSide === "Opposition" && m.role === "opponent")
      ).map((m) => m.content).join("\n\n");

      const oppSpeeches = messages.filter((m) =>
        (studentSide === "Proposition" && m.role === "opponent") ||
        (studentSide === "Opposition" && m.role === "student")
      ).map((m) => m.content).join("\n\n");

      const res = await fetch("/api/debate/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motion, propositionSpeeches: propSpeeches, oppositionSpeeches: oppSpeeches, level }),
      });
      const data: JudgeBallot = await res.json();
      setBallot(data);
      setPhase("done");

      const studentWon = data.winner === studentSide;
      recordSession({
        type: "sparring",
        level: level as 1 | 2 | 3,
        topic: motion,
        score: studentWon ? Math.min(10, Math.round(data.score / 10)) : Math.max(3, Math.round(data.score / 10) - 2),
        weaknesses: [data.mainImprovement],
      });
    } catch {}
    finally { setLoading(false); }
  }

  function reset() {
    setMessages([]);
    setInput("");
    setSpeechCount(0);
    setBallot(null);
    setPhase("setup");
  }

  const motions = MOTIONS_BY_LEVEL[level] ?? MOTIONS_BY_LEVEL[1];

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-card rounded-2xl p-5">
        <div className="mb-2 flex items-center gap-2">
          <Swords size={16} className="text-rose-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-rose-400">Sparring Partner</span>
          <span className="ml-auto rounded-full border border-[#1E293B] px-2 py-0.5 text-xs text-[#94A3B8]">Level {level}</span>
        </div>
        <p className="text-sm text-[#94A3B8]">
          {level === 1 && "Debate against your coach. They'll challenge you, ask POIs, and help you practice responding."}
          {level === 2 && "Spar against a skilled opponent who will attack your weak points and run strategic arguments."}
          {level === 3 && "Face a relentless competition-level opponent. No mercy — every weakness gets exploited."}
        </p>
      </div>

      {/* Setup */}
      {phase === "setup" && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Motion</label>
            <div className="flex flex-col gap-2">
              {motions.map((m) => (
                <button key={m} type="button" onClick={() => setMotion(m)}
                  className={clsx("rounded-xl border px-4 py-3 text-left text-sm transition-all",
                    motion === m ? "border-[#6366F1] bg-[#6366F1]/10 text-[#F1F5F9] ring-1 ring-[#6366F1]" : "border-[#1E293B] bg-[#111827] text-[#94A3B8] hover:border-[#6366F1]/50")}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#94A3B8]">Your Side</label>
            <div className="flex gap-2">
              {(["Proposition", "Opposition"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStudentSide(s)}
                  className={clsx("flex-1 rounded-xl border py-3 text-sm font-semibold transition-all",
                    studentSide === s ? s === "Proposition" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-rose-500/50 bg-rose-500/10 text-rose-400"
                    : "border-[#1E293B] bg-[#111827] text-[#94A3B8]")}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button onClick={startDebate} disabled={!motion}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#6366F1] py-4 font-semibold text-white hover:bg-[#4F46E5]">
            <Swords size={16} /> Start Debate
          </button>
        </div>
      )}

      {/* Debate */}
      {(phase === "debate" || phase === "judging") && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-2.5">
            <p className="text-xs text-[#94A3B8]">Motion: <span className="font-medium text-[#F1F5F9]">{motion}</span> — You are <span className={clsx("font-semibold", studentSide === "Proposition" ? "text-emerald-400" : "text-rose-400")}>{studentSide}</span></p>
          </div>

          {/* Messages */}
          <div className="flex max-h-96 flex-col gap-3 overflow-y-auto rounded-2xl border border-[#1E293B] bg-[#0A0F1E] p-4">
            {messages.map((msg, i) => (
              <div key={i} className={clsx("flex", msg.role === "student" ? "justify-end" : "justify-start")}>
                <div className={clsx("max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "student" ? "bg-[#6366F1] text-white" : "bg-[#111827] text-[#94A3B8] border border-[#1E293B]")}>
                  {msg.role === "opponent" && <p className="mb-1 text-xs font-bold text-rose-400">Opposition</p>}
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-[#1E293B] bg-[#111827] px-4 py-3">
                  <Loader2 size={14} className="animate-spin text-[#94A3B8]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2">
            <textarea rows={3} placeholder="Deliver your argument, respond to their point, or answer a POI…"
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) sendMessage(); }}
              className="flex-1 resize-none rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/50 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]" />
            <div className="flex flex-col gap-2">
              <button onClick={sendMessage} disabled={!input.trim() || loading}
                className={clsx("flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                  input.trim() && !loading ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]" : "bg-[#1E293B] text-[#94A3B8]")}>
                <Send size={16} />
              </button>
              {speechCount >= 3 && (
                <button onClick={requestJudge} title="Request judge ballot"
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
                  <Gavel size={16} />
                </button>
              )}
            </div>
          </div>
          {speechCount >= 3 && <p className="text-center text-xs text-[#94A3B8]">Tap <Gavel size={10} className="inline" /> to end the round and get a judge ballot</p>}
        </div>
      )}

      {/* Ballot */}
      {phase === "done" && ballot && (
        <div className="flex flex-col gap-4">
          <div className={clsx("rounded-2xl border p-5", ballot.winner === studentSide ? "border-emerald-500/30 bg-emerald-500/10" : "border-rose-500/30 bg-rose-500/10")}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gavel size={16} className={ballot.winner === studentSide ? "text-emerald-400" : "text-rose-400"} />
                <span className={clsx("font-bold", ballot.winner === studentSide ? "text-emerald-400" : "text-rose-400")}>
                  {ballot.winner === studentSide ? "You Win" : "You Lose"}
                </span>
              </div>
              <span className="text-xl font-bold text-[#F1F5F9]">{ballot.score}/100</span>
            </div>
            <p className="text-sm text-[#F1F5F9]">{ballot.reasoning}</p>
          </div>

          {[
            { label: "Clash Analysis", value: ballot.clashAnalysis },
            { label: "Impact Weighing", value: ballot.impactWeighing },
            { label: "Best Moment", value: ballot.mvp },
          ].map(({ label, value }) => (
            <div key={label} className="glass-card rounded-2xl p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p>
              <p className="text-sm text-[#94A3B8]">{value}</p>
            </div>
          ))}

          <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <Gavel size={14} className="mt-0.5 shrink-0 text-amber-400" />
            <div>
              <p className="text-xs font-semibold text-amber-400">Main Improvement</p>
              <p className="text-sm text-[#F1F5F9]">{ballot.mainImprovement}</p>
            </div>
          </div>

          <button onClick={reset} className="flex items-center justify-center gap-2 rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] hover:border-[#6366F1]/50 hover:text-[#F1F5F9]">
            <RefreshCw size={14} /> New Round
          </button>
        </div>
      )}
    </div>
  );
}
