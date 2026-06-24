"use client";

import { useRef, useState, useEffect, useCallback, Children, isValidElement, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type HomeCarouselProps = {
  children: ReactNode;
  itemWidth?: number;
  gap?: number;
  autoScroll?: boolean;
  speed?: number;
  className?: string;
};

export function HomeCarousel({
  children,
  itemWidth = 300,
  gap = 20,
  autoScroll = true,
  speed = 0.55,
  className,
}: HomeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  const childArray = Children.toArray(children).filter(isValidElement);
  const childCount = childArray.length;
  // Only loop/duplicate when there are enough unique items — otherwise clones sit side-by-side.
  const shouldAutoScroll = autoScroll && childCount >= 4;
  const loopItems =
    shouldAutoScroll ? [...childArray, ...childArray] : childArray;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => setCanScroll(el.scrollWidth > el.clientWidth + 12);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [childCount, shouldAutoScroll]);

  useEffect(() => {
    if (!shouldAutoScroll || paused) return;
    const el = scrollRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf = 0;
    const tick = () => {
      if (el && !paused) {
        el.scrollLeft += speed;
        const loopPoint = el.scrollWidth / 2;
        if (loopPoint > 0 && el.scrollLeft >= loopPoint) {
          el.scrollLeft -= loopPoint;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldAutoScroll, paused, speed, childCount]);

  const scrollBy = useCallback(
    (dir: -1 | 1) => {
      scrollRef.current?.scrollBy({
        left: dir * (itemWidth + gap) * 2,
        behavior: "smooth",
      });
    },
    [itemWidth, gap]
  );

  return (
    <div
      className={cn("home-carousel-wrap group/carousel", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {canScroll && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="home-carousel-nav home-carousel-nav--left"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="home-carousel-nav home-carousel-nav--right"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className="home-carousel"
        tabIndex={0}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="home-carousel-track" style={{ gap: `${gap}px` }}>
          {loopItems.map((child, index) => (
            <div
              key={`${child.key ?? "item"}-${index}`}
              className="home-carousel-item"
              style={{ width: itemWidth, minWidth: itemWidth }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
