"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Seamless infinite marquee.
 * Content is rendered twice and translated by -50% via CSS keyframes,
 * so the loop never jumps. Pauses on hover/focus; honours reduced motion
 * (falls back to a normal swipeable row).
 */
export function MarqueeRow({
  children,
  direction = "left",
  /** Seconds for one full loop — bigger = slower */
  duration = 60,
  gap = 20,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  direction?: "left" | "right";
  duration?: number;
  gap?: number;
  className?: string;
  ariaLabel?: string;
}) {
  const items = Children.toArray(children).filter(isValidElement);
  if (items.length === 0) return null;

  return (
    <div
      className={cn("marquee", className)}
      style={{ "--marquee-gap": `${gap}px` } as React.CSSProperties}
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          "marquee__track",
          direction === "right" && "marquee__track--reverse"
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="marquee__group"
            aria-hidden={copy === 1 || undefined}
          >
            {items.map((child, i) => (
              <div key={`${copy}-${child.key ?? i}`} className="marquee__item">
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
