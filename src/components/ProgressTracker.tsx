"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, Minus, Zap, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressMeter } from "@/components/ui/ProgressMeter";

type Verdict = "advance" | "stay" | "drop";

interface BaseProgress {
  level: number;
  xp: number;
  weaknesses: Record<string, number>;
  sessions: unknown[];
}

interface BaseDecision {
  verdict: Verdict;
  reasoning: string;
  strengths: string[];
  gaps: string[];
  nextFocus: string;
}

interface ProgressTrackerProps<P extends BaseProgress> {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  eyebrow: string;
  levelLabels: Record<number, string>;
  maxLevel: number;
  maxLevelMessage: string;
  evaluateEndpoint: string;
  progress: P | null;
  getTopWeaknesses: (p: P) => { label: string; count: number }[];
  onAcceptVerdict: (verdict: Verdict) => Promise<unknown>;
}

// Progress now lives in the ProgressProvider context (fetched from the
// database), so this component is purely presentational plus the
// level-up evaluation flow — no more localStorage polling.
export function ProgressTracker<P extends BaseProgress, D extends BaseDecision = BaseDecision>({
  icon: Icon,
  eyebrow,
  levelLabels,
  maxLevel,
  maxLevelMessage,
  evaluateEndpoint,
  progress,
  getTopWeaknesses,
  onAcceptVerdict,
}: ProgressTrackerProps<P>) {
  const [evaluating, setEvaluating] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [decision, setDecision] = useState<D | null>(null);
  const [showDecision, setShowDecision] = useState(false);
  const evaluatedRef = useRef(false);

  const runEvaluation = useCallback(
    async (p: P) => {
      setEvaluating(true);
      try {
        const res = await fetch(evaluateEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentLevel: p.level,
            sessions: p.sessions,
            weaknesses: p.weaknesses,
          }),
        });
        if (!res.ok) throw new Error();
        const dec: D = await res.json();
        setDecision(dec);
        setShowDecision(true);
      } catch {
        evaluatedRef.current = false;
      } finally {
        setEvaluating(false);
      }
    },
    [evaluateEndpoint]
  );

  useEffect(() => {
    if (!progress) return;
    if (progress.xp >= 100 && !evaluatedRef.current && !showDecision) {
      evaluatedRef.current = true;
      runEvaluation(progress);
    }
    if (progress.xp < 100) evaluatedRef.current = false;
  }, [progress, showDecision, runEvaluation]);

  async function handleAccept() {
    if (!decision) return;
    setAccepting(true);
    try {
      await onAcceptVerdict(decision.verdict);
      setShowDecision(false);
      setDecision(null);
    } finally {
      setAccepting(false);
    }
  }

  if (!progress) return null;

  const topWeaknesses = getTopWeaknesses(progress);
  const xpPercent = Math.min(progress.xp, 100);

  return (
    <div className="mb-6 flex flex-col gap-3">
      <Card padding="md">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-maroon/10 text-maroon">
              <Icon size={15} />
            </div>
            <div>
              <p className="text-xs text-stone">{eyebrow}</p>
              <p className="text-sm font-semibold text-ink">
                Level {progress.level} — {levelLabels[progress.level]}
              </p>
            </div>
          </div>
          <p className="font-display text-lg font-semibold text-ink">{xpPercent}%</p>
        </div>

        <ProgressMeter value={xpPercent} />

        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-stone">
          {evaluating ? (
            <>
              <Loader2 size={11} className="animate-spin" /> Evaluating your
              progress…
            </>
          ) : xpPercent >= 100 ? (
            "Ready for evaluation"
          ) : progress.level < maxLevel ? (
            `Complete more sessions to unlock Level ${progress.level + 1} evaluation`
          ) : (
            maxLevelMessage
          )}
        </p>
      </Card>

      {topWeaknesses.length > 0 && (
        <div className="flex items-center gap-3 rounded-md border border-ink/10 bg-paper-dim px-4 py-3">
          <Zap size={14} className="shrink-0 text-gold" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone">Focus areas:</span>
            {topWeaknesses.map(({ label, count }) => (
              <Badge key={label} variant="gold">
                {label} ×{count}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {showDecision && decision && (
        <Card padding="lg" className="border-maroon/30">
          <div className="mb-4 flex items-center gap-3">
            {decision.verdict === "advance" && (
              <>
                <ArrowUp size={20} className="text-forest" />
                <p className="font-display font-semibold text-forest">
                  Ready to advance to Level {Math.min(progress.level + 1, maxLevel)}
                </p>
              </>
            )}
            {decision.verdict === "stay" && (
              <>
                <Minus size={20} className="text-gold" />
                <p className="font-display font-semibold text-ink">
                  Stay at Level {progress.level}
                </p>
              </>
            )}
            {decision.verdict === "drop" && (
              <>
                <ArrowDown size={20} className="text-maroon" />
                <p className="font-display font-semibold text-maroon">
                  Back to Level 1
                </p>
              </>
            )}
          </div>

          <p className="mb-4 text-sm leading-relaxed text-ink-soft">
            {decision.reasoning}
          </p>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-forest">
                Strengths
              </p>
              {decision.strengths.map((s, i) => (
                <p key={i} className="mb-1 text-xs text-ink-soft">
                  ✓ {s}
                </p>
              ))}
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-maroon">
                Gaps
              </p>
              {decision.gaps.map((g, i) => (
                <p key={i} className="mb-1 text-xs text-ink-soft">
                  → {g}
                </p>
              ))}
            </div>
          </div>

          <div className="mb-4 rounded-md border border-maroon/20 bg-maroon/5 px-4 py-3">
            <p className="text-xs font-semibold text-maroon">Next focus</p>
            <p className="text-sm text-ink">{decision.nextFocus}</p>
          </div>

          <Button onClick={handleAccept} loading={accepting} size="lg" className="w-full">
            {decision.verdict === "advance"
              ? `Move to Level ${Math.min(progress.level + 1, maxLevel)}`
              : decision.verdict === "drop"
                ? "Back to Level 1"
                : "Continue at this level"}
          </Button>
        </Card>
      )}
    </div>
  );
}
