import type { DebateProgress, DebateSession, DebateLevel, SessionType } from "./types";

const STORAGE_KEY = "speakup_debate_progress";
const XP_PER_SESSION: Record<SessionType, number> = {
  speech: 18,
  sparring: 25,
  rebuttal: 12,
  case_builder: 10,
};

export function getProgress(): DebateProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultProgress();
}

export function saveProgress(progress: DebateProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function defaultProgress(): DebateProgress {
  // Pull starting level from onboarding profile
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

export function recordSession(
  session: Omit<DebateSession, "id" | "date">
): DebateProgress {
  const progress = getProgress();
  const newSession: DebateSession = {
    ...session,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  // Add XP
  const xpGain = XP_PER_SESSION[session.type];
  const newXp = Math.min(progress.xp + xpGain, 100);

  // Track weaknesses
  const weaknesses = { ...progress.weaknesses };
  session.weaknesses.forEach((w) => {
    weaknesses[w] = (weaknesses[w] ?? 0) + 1;
  });

  const updated: DebateProgress = {
    ...progress,
    xp: newXp,
    sessions: [...progress.sessions, newSession],
    weaknesses,
  };

  saveProgress(updated);
  return updated;
}

export function applyVerdict(
  verdict: "advance" | "stay" | "drop",
  current: DebateProgress
): DebateProgress {
  let newLevel = current.level;
  if (verdict === "advance" && current.level < 3) newLevel = (current.level + 1) as DebateLevel;
  if (verdict === "drop") newLevel = 1;

  const updated: DebateProgress = {
    ...current,
    level: newLevel,
    xp: 0, // reset bar on level change
  };
  saveProgress(updated);
  return updated;
}

export function getTopWeaknesses(progress: DebateProgress) {
  return Object.entries(progress.weaknesses)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([label, count]) => ({ label, count }));
}

export function shouldEvaluate(progress: DebateProgress): boolean {
  return progress.xp >= 100;
}

export function getRecentSessions(progress: DebateProgress, n = 5): DebateSession[] {
  return [...progress.sessions].reverse().slice(0, n);
}
