"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

type DossierSectionProps = {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  delay?: number;
  /** How much of the element must enter the viewport (0–1). */
  amount?: number;
  /** Skip the narrow 640px dossier-card width cap — for full-width content like catalog rails. */
  fullWidth?: boolean;
};

const slideVariants = {
  left: {
    hidden: { opacity: 0, x: -28, y: 14 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.55, ease: easeOut } },
  },
  right: {
    hidden: { opacity: 0, x: 28, y: 14 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.55, ease: easeOut } },
  },
  center: {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
  },
} as const;

/**
 * Dossier-style section reveal: content pinned to one side (or centered for
 * closing sections) with generous empty space on the other, sliding/fading
 * into view on scroll — mirrors the .section/.panel treatment in the
 * helicopter-viewer dossier concept, applied to real homescreen content
 * blocks instead of a single small card.
 */
export function DossierSection({
  children,
  className,
  align = "left",
  delay = 0,
  amount = 0.15,
  fullWidth = false,
}: DossierSectionProps) {
  // useReducedMotion() returns null on the server and the real OS
  // preference on the client's first render, so branching JSX structure on
  // it directly causes a hydration mismatch. Instead always render the
  // same motion.div, and only start suppressing animation once mounted.
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const animationsDisabled = mounted && reduceMotion;

  const alignClass =
    align === "left" ? "dossier-section--left" : align === "right" ? "dossier-section--right" : "dossier-section--center";

  const variants = slideVariants[align];

  return (
    <div className={cn("dossier-section", alignClass, className)}>
      <motion.div
        className={cn("dossier-section__inner", fullWidth && "dossier-section__inner--full")}
        initial={animationsDisabled ? false : "hidden"}
        whileInView={animationsDisabled ? undefined : "visible"}
        animate={animationsDisabled ? "visible" : undefined}
        viewport={{ once: true, amount, margin: "0px 0px -60px 0px" }}
        variants={{
          hidden: variants.hidden,
          visible: { ...variants.visible, transition: { ...variants.visible.transition, delay } },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
