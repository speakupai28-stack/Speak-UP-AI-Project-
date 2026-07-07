"use client";

import { Trophy } from "lucide-react";
import { ProgressTracker } from "@/components/ProgressTracker";
import { useDebateProgress } from "@/components/providers/ProgressProvider";
import { getTopWeaknesses } from "@/lib/progress";
import type { DebateProgress, ProgressionDecision } from "@/lib/types";

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
  const { progress, applyVerdict } = useDebateProgress();

  async function handleAccept(verdict: "advance" | "stay" | "drop") {
    const updated = await applyVerdict(verdict);
    if (updated) onLevelChange?.(updated.level);
  }

  return (
    <ProgressTracker<DebateProgress, ProgressionDecision>
      icon={Trophy}
      eyebrow="Current level"
      levelLabels={LEVEL_LABELS}
      maxLevel={3}
      maxLevelMessage="You've reached the highest level — Competition"
      evaluateEndpoint="/api/debate/progress"
      progress={progress}
      getTopWeaknesses={getTopWeaknesses}
      onAcceptVerdict={handleAccept}
    />
  );
}
