"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface CountUpProps {
  value: number;
  prefix?: string;
  className?: string;
}

export function CountUp({ value, prefix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20, mass: 1 });

  useEffect(() => {
    if (isInView && !reduceMotion) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString("en-US")}`;
      }
    });
    return unsubscribe;
  }, [spring, prefix, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {reduceMotion ? value.toLocaleString("en-US") : 0}
    </span>
  );
}
