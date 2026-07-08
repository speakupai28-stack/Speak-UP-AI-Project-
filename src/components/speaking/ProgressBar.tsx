"use client";

import { Mic2 } from "lucide-react";
import { ProgressTracker } from "@/components/ProgressTracker";
import { useSpeakingProgress } from "@/components/providers/ProgressProvider";
import { getSpeakingTopWeaknesses } from "@/lib/speakingProgress";
import type { SpeakingProgress, SpeakingProgressionDecision } from "@/lib/types";

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Style & Delivery",
  3: "Performance",
};

export default function SpeakingProgressBar({
  onLevelChange,
}: {
  onLevelChange?: (l: number) => void;
}) {
  const { progress, applyVerdict } = useSpeakingProgress();

  async function handleAccept(verdict: "advance" | "stay" | "drop") {
    const updated = await applyVerdict(verdict);
    if (updated) onLevelChange?.(updated.level);
  }

  return (
    <ProgressTracker<SpeakingProgress, SpeakingProgressionDecision>
      icon={Mic2}
      eyebrow="Speaking level"
      levelLabels={LEVEL_LABELS}
      maxLevel={3}
      maxLevelMessage="You've reached the highest level — Performance"
      evaluateEndpoint="/api/public-speaking/progress"
      progress={progress}
      getTopWeaknesses={getSpeakingTopWeaknesses}
      onAcceptVerdict={handleAccept}
    />
  );
}
