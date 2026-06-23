"use client";

import DebateArena from "@/components/debate/DebateArena";
import Level2Lessons from "@/components/debate/Level2";
import SpeechFeedback from "@/components/debate/SpeechFeedback";

export default function DebateLevel2Page() {
  return (
    <DebateArena
      defaultTab="lessons"
      LessonsComponent={Level2Lessons}
      SpeechComponent={SpeechFeedback}
    />
  );
}
