import type {
  DebateProgress as DebateProgressRow,
  DebateSessionRecord,
  SpeakingProgress as SpeakingProgressRow,
  SpeakingSessionRecord,
} from "@/generated/prisma/client";
import type { DebateProgress, DebateSession, SpeakingProgress, SpeakingSession } from "@/lib/types";

// Expects `sessions` queried with orderBy: { date: "asc" } — oldest first,
// matching the array-push order the old localStorage version relied on
// (getRecentSessions reverses when it needs newest-first for display).

export function serializeDebateProgress(
  row: DebateProgressRow & { sessions: DebateSessionRecord[] }
): DebateProgress {
  return {
    level: row.level as DebateProgress["level"],
    xp: row.xp,
    weaknesses: (row.weaknesses as Record<string, number>) ?? {},
    sessions: row.sessions.map(
      (s): DebateSession => ({
        id: s.id,
        type: s.type as DebateSession["type"],
        level: s.level as DebateSession["level"],
        topic: s.topic,
        score: s.score,
        weaknesses: s.weaknesses,
        date: s.date.toISOString(),
      })
    ),
  };
}

export function serializeSpeakingProgress(
  row: SpeakingProgressRow & { sessions: SpeakingSessionRecord[] }
): SpeakingProgress {
  return {
    level: row.level as SpeakingProgress["level"],
    xp: row.xp,
    weaknesses: (row.weaknesses as Record<string, number>) ?? {},
    sessions: row.sessions.map(
      (s): SpeakingSession => ({
        id: s.id,
        type: s.type as SpeakingSession["type"],
        level: s.level as SpeakingSession["level"],
        topic: s.topic,
        score: s.score,
        weaknesses: s.weaknesses,
        date: s.date.toISOString(),
      })
    ),
  };
}
