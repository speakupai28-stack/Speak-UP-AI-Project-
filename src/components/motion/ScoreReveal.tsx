"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ScoreRevealProps {
  children: React.ReactNode;
  revealKey: string | number;
  className?: string;
}

export function ScoreReveal({ children, revealKey, className }: ScoreRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      key={revealKey}
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
