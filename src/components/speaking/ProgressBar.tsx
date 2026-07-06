"use client";

import { Mic2 } from "lucide-react";
import { ProgressTracker } from "@/components/ProgressTracker";
import {
  getSpeakingProgress,
  applySpeakingVerdict,
  shouldEvaluateSpeaking,
  getSpeakingTopWeaknesses,
} from "@/lib/speakingProgress";
import type { SpeakingProgressionDecision } from "@/lib/types";

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
  return (
    <ProgressTracker<ReturnType<typeof getSpeakingProgress>, SpeakingProgressionDecision>
      icon={Mic2}
      eyebrow="Speaking level"
      levelLabels={LEVEL_LABELS}
      maxLevel={3}
      maxLevelMessage="You've reached the highest level — Performance"
      evaluateEndpoint="/api/public-speaking/progress"
      getProgress={getSpeakingProgress}
      shouldEvaluate={shouldEvaluateSpeaking}
      applyVerdict={applySpeakingVerdict}
      getTopWeaknesses={getSpeakingTopWeaknesses}
      onLevelChange={onLevelChange}
    />
  );
}
