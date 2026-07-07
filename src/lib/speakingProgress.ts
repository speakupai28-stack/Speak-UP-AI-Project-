import type { SpeakingProgress, SpeakingSession, SpeakingSessionType } from "./types";

export const XP_PER_SPEAKING_SESSION: Record<SpeakingSessionType, number> = {
  upload: 20,
  event: 15,
  articulation: 10,
};

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
