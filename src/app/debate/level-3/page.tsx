"use client";

import DebateArena from "@/components/debate/DebateArena";
import Level3Lessons from "@/components/debate/Level3";
import SpeechFeedback from "@/components/debate/SpeechFeedback";

export default function DebateLevel3Page() {
  return (
    <DebateArena
      defaultTab="lessons"
      LessonsComponent={Level3Lessons}
      SpeechComponent={SpeechFeedback}
    />
  );
}
