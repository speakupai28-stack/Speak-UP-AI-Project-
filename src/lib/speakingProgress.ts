import type { SpeakingProgress, SpeakingSession, SpeakingSessionType, DebateLevel } from "./types";

const STORAGE_KEY = "speakup_speaking_progress";
const XP_PER_SESSION: Record<SpeakingSessionType, number> = {
  upload: 20,
  event: 15,
  articulation: 10,
};

export function getSpeakingProgress(): SpeakingProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultProgress();
}

export function saveSpeakingProgress(progress: SpeakingProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function defaultProgress(): SpeakingProgress {
  let startLevel: DebateLevel = 1;
  try {
    const raw = localStorage.getItem("speakup_user");
    if (raw) {
      const user = JSON.parse(raw);
      if (user.experience === "intermediate") startLevel = 2;
      if (user.experience === "advanced") startLevel = 3;
    }
  } catch {}
  return { level: startLevel, xp: 0, sessions: [], weaknesses: {} };
}

export function recordSpeakingSession(
  session: Omit<SpeakingSession, "id" | "date">
): SpeakingProgress {
  const progress = getSpeakingProgress();
  const newSession: SpeakingSession = {
    ...session,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  const xpGain = XP_PER_SESSION[session.type];
  const newXp = Math.min(progress.xp + xpGain, 100);

  const weaknesses = { ...progress.weaknesses };
  session.weaknesses.forEach((w) => {
    weaknesses[w] = (weaknesses[w] ?? 0) + 1;
  });

  const updated: SpeakingProgress = {
    ...progress,
    xp: newXp,
    sessions: [...progress.sessions, newSession],
    weaknesses,
  };

  saveSpeakingProgress(updated);
  return updated;
}

export function applySpeakingVerdict(
  verdict: "advance" | "stay" | "drop",
  current: SpeakingProgress
): SpeakingProgress {
  let newLevel = current.level;
  if (verdict === "advance" && current.level < 3) newLevel = (current.level + 1) as DebateLevel;
  if (verdict === "drop") newLevel = 1;
  const updated = { ...current, level: newLevel, xp: 0 };
  saveSpeakingProgress(updated);
  return updated;
}

export function getSpeakingTopWeaknesses(progress: SpeakingProgress) {
  return Object.entries(progress.weaknesses)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([label, count]) => ({ label, count }));
}

export function shouldEvaluateSpeaking(progress: SpeakingProgress): boolean {
  return progress.xp >= 100;
}

export function getRecentSpeakingSessions(progress: SpeakingProgress, n = 5): SpeakingSession[] {
  return [...progress.sessions].reverse().slice(0, n);
}
