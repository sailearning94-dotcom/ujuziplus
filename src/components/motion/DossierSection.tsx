"use client";

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
}: DossierSectionProps) {
  const reduceMotion = useReducedMotion();

  const alignClass =
    align === "left" ? "dossier-section--left" : align === "right" ? "dossier-section--right" : "dossier-section--center";

  if (reduceMotion) {
    return (
      <div className={cn("dossier-section", alignClass, className)}>
        <div className="dossier-section__inner">{children}</div>
      </div>
    );
  }

  const variants = slideVariants[align];

  return (
    <div className={cn("dossier-section", alignClass, className)}>
      <motion.div
        className="dossier-section__inner"
        initial="hidden"
        whileInView="visible"
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
