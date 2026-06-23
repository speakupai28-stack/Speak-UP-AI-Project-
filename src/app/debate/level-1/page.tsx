"use client";

import DebateArena from "@/components/debate/DebateArena";
import Level1Lessons from "@/components/debate/Level1";
import SpeechFeedback from "@/components/debate/SpeechFeedback";

export default function DebateLevel1Page() {
  return (
    <DebateArena
      defaultTab="lessons"
      LessonsComponent={Level1Lessons}
      SpeechComponent={SpeechFeedback}
    />
  );
}
