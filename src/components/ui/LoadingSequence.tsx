"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface LoadingSequenceProps {
  messages: string[];
  className?: string;
  interval?: number;
}

export function LoadingSequence({
  messages,
  className,
  interval = 1600,
}: LoadingSequenceProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), interval);
    return () => clearInterval(id);
  }, [messages.length, interval]);

  if (reduceMotion) {
    return <p className={className}>{messages[index]}</p>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={index}
        className={className}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
      >
        {messages[index]}
      </motion.p>
    </AnimatePresence>
  );
}
