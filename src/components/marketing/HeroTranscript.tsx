"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";

const STUDENT_LINE =
  "Immigration reform reduces long-term strain on public services.";
const COACH_LINE =
  "Strong claim — but where's the warrant? Tie the strain reduction to a mechanism, then weigh it against their impact.";

export function HeroTranscript() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });
  const reduceMotion = useReducedMotion();
  const [charCount, setCharCount] = useState(reduceMotion ? COACH_LINE.length : 0);

  useEffect(() => {
    if (!isInView || reduceMotion) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setCharCount(i);
      if (i >= COACH_LINE.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [isInView, reduceMotion]);

  const shown = COACH_LINE.slice(0, charCount);
  const done = charCount >= COACH_LINE.length;

  return (
    <div
      ref={ref}
      className="w-full max-w-sm rounded-lg border border-ink/10 bg-paper-dim p-5 shadow-[var(--shadow-card)]"
    >
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone">
        <Zap size={12} className="text-maroon" />
        Live rebuttal
      </div>

      <div className="mb-3 ml-auto w-fit max-w-[85%] rounded-md rounded-tr-none bg-ink px-3.5 py-2.5 text-sm text-paper">
        {STUDENT_LINE}
      </div>

      <div className="w-fit max-w-[90%] rounded-md rounded-tl-none border border-maroon/20 bg-paper px-3.5 py-2.5 text-sm text-ink">
        {shown}
        {!done && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-3.5 w-[2px] -mb-0.5 animate-pulse bg-maroon"
          />
        )}
      </div>
    </div>
  );
}
