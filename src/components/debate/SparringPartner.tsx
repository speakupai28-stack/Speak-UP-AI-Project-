"use client";

import { useRef, useState } from "react";
import { clsx } from "clsx";
import { Send, Swords, RefreshCw, Gavel } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreReveal } from "@/components/motion/ScoreReveal";
import { useDebateProgress } from "@/components/providers/ProgressProvider";
import type { SparringMessage, JudgeBallot } from "@/lib/types";

const MOTIONS_BY_LEVEL: Record<number, string[]> = {
  1: ["Social media does more harm than good", "Schools should have a 4-day week", "Homework should be abolished"],
  2: ["Universal basic income should be implemented", "Nuclear energy is key to solving climate change", "The death penalty should be abolished"],
  3: ["The UN Security Council veto should be abolished", "Developed nations owe climate refugees legal protection", "Algorithmic content moderation threatens free speech"],
};

interface SparringPartnerProps {
  level?: number;
}

async function streamOpponentReply(
  body: object,
  onChunk: (fullTextSoFar: string) => void
) {
  const res = await fetch("/api/debate/sparring", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok || !res.body) throw new Error();

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    onChunk(full);
  }
  return full;
}

export default function SparringPartner({ level: propLevel }: SparringPartnerProps) {
  const { recordSession } = useDebateProgress();
  const level = propLevel ?? 1;
  const motions = MOTIONS_BY_LEVEL[level] ?? MOTIONS_BY_LEVEL[1];
  const [motion, setMotion] = useState(() => motions[0] ?? "");
  const [studentSide, setStudentSide] = useState<"Proposition" | "Opposition">("Proposition");
  const [messages, setMessages] = useState<SparringMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"setup" | "debate" | "judging" | "done">("setup");
  const [ballot, setBallot] = useState<JudgeBallot | null>(null);
  const [speechCount, setSpeechCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  function scrollDown() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function startDebate() {
    setPhase("debate");
    setLoading(true);
    setMessages([{ role: "opponent", content: "" }]);
    try {
      await streamOpponentReply(
        { motion, studentSide, messages: [], level },
        (text) => {
          setMessages([{ role: "opponent", content: text }]);
          scrollDown();
        }
      );
    } catch {
      setMessages([{ role: "opponent", content: "Something went wrong. Try starting again." }]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: SparringMessage = { role: "student", content: input };
    const newMessages = [...messages, userMsg];
    setMessages([...newMessages, { role: "opponent", content: "" }]);
    setInput("");
    setSpeechCount((c) => c + 1);
    setLoading(true);

    try {
      await streamOpponentReply(
        { motion, studentSide, messages: newMessages, level },
        (text) => {
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: "opponent", content: text };
            return next;
          });
          scrollDown();
        }
      );
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "opponent", content: "Something went wrong." };
        return next;
      });
    } finally {
      setLoading(false);
    }
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
      await recordSession({
        type: "sparring",
        level: level as 1 | 2 | 3,
        topic: motion,
        score: studentWon ? Math.min(10, Math.round(data.score / 10)) : Math.max(3, Math.round(data.score / 10) - 2),
        weaknesses: [data.mainImprovement],
      });
    } catch {
      // leave phase as "judging"; user can retry via reset
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([]);
    setInput("");
    setSpeechCount(0);
    setBallot(null);
    setPhase("setup");
  }

  return (
    <div className="flex flex-col gap-5">
      <Card padding="md">
        <div className="mb-2 flex items-center gap-2">
          <Swords size={16} className="text-maroon" />
          <span className="text-xs font-semibold uppercase tracking-wide text-maroon">Sparring Partner</span>
          <Badge variant="neutral" className="ml-auto">Level {level}</Badge>
        </div>
        <p className="text-sm text-ink-soft">
          {level === 1 && "Debate against your coach. They'll challenge you, ask POIs, and help you practice responding."}
          {level === 2 && "Spar against a skilled opponent who will attack your weak points and run strategic arguments."}
          {level === 3 && "Face a relentless competition-level opponent. No mercy — every weakness gets exploited."}
        </p>
      </Card>

      {/* Setup */}
      {phase === "setup" && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-soft">Motion</label>
            <div className="flex flex-col gap-2">
              {motions.map((m) => (
                <button key={m} type="button" onClick={() => setMotion(m)}
                  className={clsx("rounded-md border px-4 py-3 text-left text-sm transition-all",
                    motion === m ? "border-maroon bg-maroon/5 text-ink ring-1 ring-maroon" : "border-ink/10 bg-paper-dim text-ink-soft hover:border-maroon/40")}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink-soft">Your Side</label>
            <div className="flex gap-2">
              {(["Proposition", "Opposition"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStudentSide(s)}
                  className={clsx("flex-1 rounded-md border py-3 text-sm font-semibold transition-all",
                    studentSide === s ? "border-maroon bg-maroon/5 text-maroon" : "border-ink/10 bg-paper-dim text-ink-soft")}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={startDebate} disabled={!motion} size="lg">
            <Swords size={16} /> Start Debate
          </Button>
        </div>
      )}

      {/* Debate */}
      {(phase === "debate" || phase === "judging") && (
        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-ink/10 bg-paper-dim px-4 py-2.5">
            <p className="text-xs text-ink-soft">Motion: <span className="font-medium text-ink">{motion}</span> — You are <span className="font-semibold text-maroon">{studentSide}</span></p>
          </div>

          {/* Messages */}
          <div className="flex max-h-96 flex-col gap-3 overflow-y-auto rounded-lg border border-ink/10 bg-paper-dim p-4">
            {messages.map((msg, i) => {
              const isStreamingBubble = loading && i === messages.length - 1 && msg.role === "opponent";
              return (
                <div key={i} className={clsx("flex", msg.role === "student" ? "justify-end" : "justify-start")}>
                  <div className={clsx("max-w-[80%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed",
                    msg.role === "student" ? "bg-ink text-paper" : "border border-ink/10 bg-paper text-ink")}>
                    {msg.role === "opponent" && <p className="mb-1 text-xs font-bold text-maroon">Opposition</p>}
                    {isStreamingBubble && msg.content === "" ? (
                      <span className="flex items-center gap-1 py-0.5 text-ink-soft">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </span>
                    ) : (
                      <>
                        {msg.content}
                        {isStreamingBubble && (
                          <span aria-hidden="true" className="ml-0.5 inline-block h-3.5 w-[2px] -mb-0.5 animate-pulse bg-maroon" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2">
            <textarea rows={3} placeholder="Deliver your argument, respond to their point, or answer a POI…"
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) sendMessage(); }}
              className="flex-1 resize-none rounded-md border border-stone-light bg-paper px-4 py-3 text-sm text-ink placeholder:text-stone outline-none focus:border-maroon focus:ring-1 focus:ring-maroon" />
            <div className="flex flex-col gap-2">
              <button onClick={sendMessage} disabled={!input.trim() || loading}
                className={clsx("flex h-12 w-12 items-center justify-center rounded-md transition-colors",
                  input.trim() && !loading ? "bg-maroon text-paper hover:bg-maroon-dark" : "bg-ink/10 text-stone")}>
                <Send size={16} />
              </button>
              {speechCount >= 3 && (
                <button onClick={requestJudge} title="Request judge ballot"
                  className="flex h-12 w-12 items-center justify-center rounded-md bg-gold/15 text-[#8a6b28] hover:bg-gold/25">
                  <Gavel size={16} />
                </button>
              )}
            </div>
          </div>
          {speechCount >= 3 && <p className="text-center text-xs text-stone">Tap <Gavel size={10} className="inline" /> to end the round and get a judge ballot</p>}
        </div>
      )}

      {/* Ballot */}
      {phase === "done" && ballot && (
        <ScoreReveal revealKey={ballot.score} className="flex flex-col gap-4">
          <div className={clsx("rounded-lg border p-5", ballot.winner === studentSide ? "border-forest/30 bg-forest/5" : "border-maroon/30 bg-maroon/5")}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gavel size={16} className={ballot.winner === studentSide ? "text-forest" : "text-maroon"} />
                <span className={clsx("font-display font-semibold", ballot.winner === studentSide ? "text-forest" : "text-maroon")}>
                  {ballot.winner === studentSide ? "You Win" : "You Lose"}
                </span>
              </div>
              <span className="font-display text-xl font-semibold text-ink">{ballot.score}/100</span>
            </div>
            <p className="text-sm text-ink">{ballot.reasoning}</p>
          </div>

          {[
            { label: "Clash Analysis", value: ballot.clashAnalysis },
            { label: "Impact Weighing", value: ballot.impactWeighing },
            { label: "Best Moment", value: ballot.mvp },
          ].map(({ label, value }) => (
            <Card key={label} padding="md">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone">{label}</p>
              <p className="text-sm text-ink-soft">{value}</p>
            </Card>
          ))}

          <div className="flex items-start gap-3 rounded-md border border-gold/30 bg-gold/5 p-4">
            <Gavel size={14} className="mt-0.5 shrink-0 text-[#8a6b28]" />
            <div>
              <p className="text-xs font-semibold text-[#8a6b28]">Main Improvement</p>
              <p className="text-sm text-ink">{ballot.mainImprovement}</p>
            </div>
          </div>

          <Button variant="secondary" onClick={reset}>
            <RefreshCw size={14} /> New Round
          </Button>
        </ScoreReveal>
      )}
    </div>
  );
}
