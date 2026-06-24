"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "framer-motion";

const trackVariants = cva("overflow-hidden rounded-full bg-gray-100 ring-1 ring-inset ring-gray-200/50", {
  variants: {
    size: {
      sm: "h-1.5",
      md: "h-2.5",
      lg: "h-3.5",
    },
  },
  defaultVariants: { size: "md" },
});

export function ProgressBar({
  value,
  className,
  showLabel = false,
  size,
  label = "Progress",
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
} & VariantProps<typeof trackVariants>) {
  const reduceMotion = useReducedMotion();
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium">
          <span className="text-gray-500">{label}</span>
          <span className="tabular-nums text-brand">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={cn(trackVariants({ size }))}>
        <motion.div
          className="progress-shine h-full rounded-full"
          initial={{ width: reduceMotion ? `${pct}%` : "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
