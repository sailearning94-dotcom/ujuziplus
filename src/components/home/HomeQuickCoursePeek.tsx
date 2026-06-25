"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarqueeRow } from "@/components/home/MarqueeRow";
import { HomeCourseCard } from "@/components/home/HomeCourseCard";

type CourseItem = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  instructorName: string;
  durationHours: number;
  level: string;
  category: string | null;
  isFree: boolean;
};

/** Trending course rail — smooth auto-scroll marquee with spotlight card motion. */
export function HomeQuickCoursePeek({ courses }: { courses: CourseItem[] }) {
  const peek = courses.slice(0, 8);
  if (peek.length === 0) return null;

  const duration = Math.max(38, peek.length * 7);

  return (
    <section className="home-rail home-trending-rail" aria-label="Trending courses">
      <div className="home-rail__header">
        <div className="home-rail__copy">
          <h2 className="home-trending-rail__title">
            <span className="home-trending-rail__live" aria-hidden />
            Trending now
          </h2>
          <p className="home-rail__desc">
            Popular courses learners are starting this week.
          </p>
        </div>
        <Link href="/courses" className="home-rail__link">
          All courses
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="home-trending-rail__stage">
        <MarqueeRow
          duration={duration}
          gap={18}
          ariaLabel="Trending courses"
          className="home-trending-marquee"
        >
          {peek.map((c) => (
            <HomeCourseCard key={c.id} {...c} variant="trending" />
          ))}
        </MarqueeRow>
      </div>
    </section>
  );
}
