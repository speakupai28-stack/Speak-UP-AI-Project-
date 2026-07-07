"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type {
  DebateProgress,
  DebateSession,
  SpeakingProgress,
  SpeakingSession,
  UserData,
} from "@/lib/types";

type Verdict = "advance" | "stay" | "drop";
type Me = UserData & { id: string; email: string; plan: string };

interface ProgressContextValue {
  me: Me | null;
  meLoaded: boolean;
  debateProgress: DebateProgress | null;
  speakingProgress: SpeakingProgress | null;
  recordDebateSession: (input: Omit<DebateSession, "id" | "date">) => Promise<DebateProgress | null>;
  recordSpeakingSession: (
    input: Omit<SpeakingSession, "id" | "date">
  ) => Promise<SpeakingProgress | null>;
  applyDebateVerdict: (verdict: Verdict) => Promise<DebateProgress | null>;
  applySpeakingVerdict: (verdict: Verdict) => Promise<SpeakingProgress | null>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  return res.json();
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [me, setMe] = useState<Me | null>(null);
  const [meLoaded, setMeLoaded] = useState(false);
  const [debateProgress, setDebateProgress] = useState<DebateProgress | null>(null);
  const [speakingProgress, setSpeakingProgress] = useState<SpeakingProgress | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      // Mirrors next-auth's external session status into local state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMeLoaded(status !== "loading");
      return;
    }

    let cancelled = false;
    (async () => {
      const [meRes, debateRes, speakingRes] = await Promise.all([
        fetch("/api/me"),
        fetch("/api/progress/debate"),
        fetch("/api/progress/speaking"),
      ]);
      if (cancelled) return;
      if (meRes.ok) setMe(await meRes.json());
      if (debateRes.ok) setDebateProgress(await debateRes.json());
      if (speakingRes.ok) setSpeakingProgress(await speakingRes.json());
      setMeLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);

  const recordDebateSession = useCallback(async (input: Omit<DebateSession, "id" | "date">) => {
    const updated = await postJson<DebateProgress>("/api/progress/debate/session", input);
    if (updated) setDebateProgress(updated);
    return updated;
  }, []);

  const recordSpeakingSession = useCallback(
    async (input: Omit<SpeakingSession, "id" | "date">) => {
      const updated = await postJson<SpeakingProgress>("/api/progress/speaking/session", input);
      if (updated) setSpeakingProgress(updated);
      return updated;
    },
    []
  );

  const applyDebateVerdict = useCallback(async (verdict: Verdict) => {
    const updated = await postJson<DebateProgress>("/api/progress/debate/verdict", { verdict });
    if (updated) setDebateProgress(updated);
    return updated;
  }, []);

  const applySpeakingVerdict = useCallback(async (verdict: Verdict) => {
    const updated = await postJson<SpeakingProgress>("/api/progress/speaking/verdict", { verdict });
    if (updated) setSpeakingProgress(updated);
    return updated;
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        me,
        meLoaded,
        debateProgress,
        speakingProgress,
        recordDebateSession,
        recordSpeakingSession,
        applyDebateVerdict,
        applySpeakingVerdict,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

function useProgressContext() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgressContext must be used within a ProgressProvider");
  return ctx;
}

export function useMe() {
  const { me, meLoaded } = useProgressContext();
  return { me, loaded: meLoaded };
}

export function useDebateProgress() {
  const { debateProgress, recordDebateSession, applyDebateVerdict } = useProgressContext();
  return { progress: debateProgress, recordSession: recordDebateSession, applyVerdict: applyDebateVerdict };
}

export function useSpeakingProgress() {
  const { speakingProgress, recordSpeakingSession, applySpeakingVerdict } = useProgressContext();
  return {
    progress: speakingProgress,
    recordSession: recordSpeakingSession,
    applyVerdict: applySpeakingVerdict,
  };
}
