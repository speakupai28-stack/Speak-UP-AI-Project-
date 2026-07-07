"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { Send, Sparkles, MessageSquare, Globe2, Mic2, Target, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { useMe } from "@/components/providers/ProgressProvider";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const FOCUS_META: Record<string, { icon: typeof MessageSquare; href: string; label: string }> = {
  debate: { icon: MessageSquare, href: "/debate", label: "Debate" },
  "model-un": { icon: Globe2, href: "/model-un", label: "Model UN" },
  "public-speaking": { icon: Mic2, href: "/public-speaking", label: "Public Speaking" },
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
  const { me: user, loaded } = useMe();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const greetedRef = useRef(false);

  useEffect(() => {
    if (user && !greetedRef.current) {
      greetedRef.current = true;
      const greeting =
        user.profile?.greeting ?? `Hey ${user.name ?? ""}! I'm your personal coach. What are we working on today?`;
      setMessages([{ role: "assistant", content: greeting }]);
    }
  }, [user]);

  const streamedTextRef = useRef("");

  async function send(text?: string) {
    const messageText = (text ?? input).trim();
    if (!messageText || loading || !user) return;

    const userMessage: ChatMessage = { role: "user", content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
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

      if (!res.ok || !res.body) throw new Error();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      streamedTextRef.current = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamedTextRef.current += decoder.decode(value, { stream: true });
        const content = streamedTextRef.current;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content };
          return next;
        });
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: "Something went wrong. Try again." };
        return next;
      });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  if (loaded && !user) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-4 px-4 text-center">
        <Target size={40} className="text-maroon" />
        <h1 className="font-display text-2xl font-semibold text-ink">No profile found</h1>
        <p className="text-ink-soft">Complete the onboarding survey so your coach knows who you are.</p>
        <ButtonLink href="/onboarding">Get Started</ButtonLink>
      </div>
    );
  }

  if (!user) return null;

  const focusAreas = (user.focus ?? []).filter((f) => FOCUS_META[f]);
  const starterPrompts = focusAreas.flatMap((f) => (STARTER_PROMPTS_BY_FOCUS[f] ?? []).slice(0, 2)).slice(0, 4);
  const lastMessage = messages[messages.length - 1];
  const isThinking = loading && lastMessage?.role === "assistant" && lastMessage.content === "";
  const isStreaming = loading && lastMessage?.role === "assistant" && lastMessage.content !== "";

  return (
    <div className="mx-auto flex max-h-[calc(100vh-65px)] max-w-3xl flex-col px-4 py-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles size={16} className="text-maroon" />
            <span className="text-xs font-semibold uppercase tracking-wide text-maroon">Your Coach</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">{user.name}&apos;s Coach</h1>
          <div className="mt-1 flex flex-wrap gap-2">
            {focusAreas.map((f) => {
              const meta = FOCUS_META[f];
              const Icon = meta.icon;
              return (
                <Link
                  key={f}
                  href={meta.href}
                  className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper-dim px-3 py-1 text-xs transition-colors hover:border-maroon/40"
                >
                  <Icon size={11} className="text-maroon" />
                  <span className="text-ink-soft">{meta.label}</span>
                  <ChevronRight size={10} className="text-stone" />
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-ink/10 bg-paper-dim px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-forest" />
          <span className="text-xs text-ink-soft">Online</span>
        </div>
      </div>

      {/* Weekly Goal */}
      {user.profile?.weeklyGoal && (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-maroon/20 bg-maroon/5 px-4 py-3">
          <Target size={14} className="mt-0.5 shrink-0 text-maroon" />
          <div>
            <p className="text-xs font-semibold text-maroon">This Week&apos;s Goal</p>
            <p className="text-sm text-ink">{user.profile.weeklyGoal}</p>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-lg border border-ink/10 bg-paper-dim p-4"
        style={{ maxHeight: "50vh" }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={clsx("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={clsx(
                "max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-ink text-paper"
                  : "border border-ink/10 bg-paper text-ink"
              )}
            >
              {i === messages.length - 1 && isThinking ? (
                <span className="flex items-center gap-1 py-0.5 text-ink-soft">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </span>
              ) : (
                <>
                  {msg.content}
                  {i === messages.length - 1 && isStreaming && (
                    <span
                      aria-hidden="true"
                      className="ml-0.5 inline-block h-3.5 w-[2px] -mb-0.5 animate-pulse bg-maroon"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Starter Prompts */}
      {!started && starterPrompts.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              className="rounded-md border border-ink/10 bg-paper-dim px-3 py-2.5 text-left text-xs text-ink-soft transition-colors hover:border-maroon/40 hover:text-ink"
            >
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
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          className="flex-1 resize-none rounded-md border border-stone-light bg-paper px-4 py-3 text-sm text-ink placeholder:text-stone outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className={clsx(
            "flex h-auto items-center justify-center rounded-md px-4 transition-colors",
            input.trim() && !loading
              ? "bg-maroon text-paper hover:bg-maroon-dark"
              : "bg-ink/10 text-stone"
          )}
        >
          <Send size={16} />
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-stone">Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
