"use client";

import SpeakingArena from "@/components/speaking/SpeakingArena";
import SpeakingLevel1 from "@/components/speaking/Level1";

export default function SpeakingLevel1Page() {
  return <SpeakingArena LessonsComponent={SpeakingLevel1} />;
}
