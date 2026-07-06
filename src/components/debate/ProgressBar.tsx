"use client";

import { Trophy } from "lucide-react";
import { ProgressTracker } from "@/components/ProgressTracker";
import { getProgress, applyVerdict, shouldEvaluate, getTopWeaknesses } from "@/lib/progress";
import type { ProgressionDecision } from "@/lib/types";

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Strategy",
  3: "Competition",
};

export default function ProgressBar({
  onLevelChange,
}: {
  onLevelChange?: (newLevel: number) => void;
}) {
  return (
    <ProgressTracker<ReturnType<typeof getProgress>, ProgressionDecision>
      icon={Trophy}
      eyebrow="Current level"
      levelLabels={LEVEL_LABELS}
      maxLevel={3}
      maxLevelMessage="You've reached the highest level — Competition"
      evaluateEndpoint="/api/debate/progress"
      getProgress={getProgress}
      shouldEvaluate={shouldEvaluate}
      applyVerdict={applyVerdict}
      getTopWeaknesses={getTopWeaknesses}
      onLevelChange={onLevelChange}
    />
  );
}
