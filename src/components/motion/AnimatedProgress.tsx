"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AnimatedProgress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="animated-progress__track">
        <motion.div
          className="animated-progress__bar progress-shine"
          initial={{ width: reduceMotion ? `${clamped}%` : "0%" }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
        {[25, 50, 75].map((mark) => (
          <span
            key={mark}
            className="animated-progress__mark"
            style={{ left: `${mark}%` }}
            data-passed={clamped >= mark ? "true" : "false"}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
