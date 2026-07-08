import type { DebateProgress, DebateSession, SessionType } from "./types";

export const XP_PER_SESSION: Record<SessionType, number> = {
  speech: 18,
  sparring: 25,
  rebuttal: 12,
  case_builder: 10,
};

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
