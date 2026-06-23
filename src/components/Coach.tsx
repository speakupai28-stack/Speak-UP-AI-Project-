"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { Send, Loader2, Sparkles, MessageSquare, Globe2, Mic2, Target, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { UserData } from "@/lib/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const FOCUS_META: Record<string, { icon: typeof MessageSquare; color: string; href: string; label: string }> = {
  debate: { icon: MessageSquare, color: "text-indigo-400", href: "/debate", label: "Debate" },
  "model-un": { icon: Globe2, color: "text-blue-400", href: "/model-un", label: "Model UN" },
  "public-speaking": { icon: Mic2, color: "text-teal-400", href: "/public-speaking", label: "Public Speaking" },
};

const STARTER_PROMPTS_BY_FOCUS: Record<string, string[]> = {
  debate: [
    "Help me build a stronger argument for my next round",
    "What's the best way to handle cross-examination?",
    "Review this rebuttal and tell me how to improve it",
    "How do I weigh my impacts better?",
  ],
  "model-un": [
    "Help me research my country's position on this topic",
    "How do I write a strong opening speech?",
    "What makes a working paper stand out in committee?",
    "Give me lobbying tips for my next conference",
  ],
  "public-speaking": [
    "Help me write a stronger opening hook",
    "How do I stop using filler words like 'um' and 'uh'?",
    "Give me feedback on this speech I'm working on",
    "How do I manage nerves before a big presentation?",
  ],
};

export default function Coach() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("speakup_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        // Set the opening message from the AI profile
        const greeting = parsed?.profile?.greeting ?? `Hey ${parsed?.name ?? ""}! I'm your personal coach. What are we working on today?`;
        setMessages([{ role: "assistant", content: greeting }]);
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const messageText = (text ?? input).trim();
    if (!messageText || loading || !user) return;

    const userMessage: ChatMessage = { role: "user", content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setStarted(true);
    setLoading(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          profile: {
            name: user.name,
            experience: user.experience,
            focus: user.focus,
            goal: user.goal,
            aiProfile: user.profile,
          },
        }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  // No profile
  if (loaded && !user) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-4 text-center px-4">
        <Target size={40} className="text-[#6366F1]" />
        <h1 className="text-2xl font-bold text-[#F1F5F9]">No profile found</h1>
        <p className="text-[#94A3B8]">Complete the onboarding survey so your coach knows who you are.</p>
        <Link href="/onboarding" className="rounded-full bg-[#6366F1] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4F46E5]">
          Get Started
        </Link>
      </div>
    );
  }

  if (!loaded) return null;

  const focusAreas = (user!.focus ?? []).filter((f) => FOCUS_META[f]);
  const starterPrompts = focusAreas.flatMap((f) => (STARTER_PROMPTS_BY_FOCUS[f] ?? []).slice(0, 2)).slice(0, 4);

  return (
    <div className="mx-auto flex max-h-[calc(100vh-65px)] max-w-3xl flex-col px-4 py-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles size={16} className="text-[#6366F1]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">Your Coach</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">{user!.name}&apos;s Coach</h1>
          <div className="mt-1 flex flex-wrap gap-2">
            {focusAreas.map((f) => {
              const meta = FOCUS_META[f];
              const Icon = meta.icon;
              return (
                <Link key={f} href={meta.href}
                  className="flex items-center gap-1.5 rounded-full border border-[#1E293B] bg-[#111827] px-3 py-1 text-xs transition-colors hover:border-[#6366F1]/50">
                  <Icon size={11} className={meta.color} />
                  <span className="text-[#94A3B8]">{meta.label}</span>
                  <ChevronRight size={10} className="text-[#94A3B8]" />
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#1E293B] bg-[#111827] px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-[#94A3B8]">Online</span>
        </div>
      </div>

      {/* Weekly Goal */}
      {user!.profile?.weeklyGoal && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-3">
          <Target size={14} className="mt-0.5 shrink-0 text-[#6366F1]" />
          <div>
            <p className="text-xs font-semibold text-[#6366F1]">This Week&apos;s Goal</p>
            <p className="text-sm text-[#F1F5F9]">{user!.profile.weeklyGoal}</p>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl border border-[#1E293B] bg-[#0A0F1E] p-4 min-h-0" style={{ maxHeight: "50vh" }}>
        {messages.map((msg, i) => (
          <div key={i} className={clsx("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={clsx(
              "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              msg.role === "user"
                ? "bg-[#6366F1] text-white"
                : "border border-[#1E293B] bg-[#111827] text-[#F1F5F9]"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl border border-[#1E293B] bg-[#111827] px-4 py-3">
              <Loader2 size={14} className="animate-spin text-[#6366F1]" />
              <span className="text-xs text-[#94A3B8]">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Starter Prompts */}
      {!started && starterPrompts.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {starterPrompts.map((prompt) => (
            <button key={prompt} onClick={() => send(prompt)}
              className="rounded-xl border border-[#1E293B] bg-[#111827] px-3 py-2.5 text-left text-xs text-[#94A3B8] transition-colors hover:border-[#6366F1]/50 hover:text-[#F1F5F9]">
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <textarea
          ref={inputRef}
          rows={2}
          placeholder={`Ask your coach anything about ${focusAreas.map((f) => FOCUS_META[f]?.label).join(", ")}…`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          className="flex-1 resize-none rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
        />
        <button onClick={() => send()} disabled={!input.trim() || loading}
          className={clsx("flex h-full items-center justify-center rounded-xl px-4 transition-colors",
            input.trim() && !loading ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]" : "bg-[#1E293B] text-[#94A3B8]")}>
          <Send size={16} />
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-[#94A3B8]">Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
