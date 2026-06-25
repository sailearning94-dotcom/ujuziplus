"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarqueeRow } from "@/components/home/MarqueeRow";
import { HomeCourseCard } from "@/components/home/HomeCourseCard";
import type { CourseStoreItem } from "@/components/courses/CourseStoreCard";

export function CourseTrendingRail({
  courses,
  onEnroll,
}: {
  courses: CourseStoreItem[];
  onEnroll: (course: CourseStoreItem) => void;
}) {
  if (courses.length < 2) return null;

  const duration = Math.max(40, courses.length * 7);

  return (
    <section className="course-trending-section" aria-label="Trending courses">

      {/* Header */}
      <div className="home-rail__header">
        <div className="home-rail__copy">
          <h2 className="home-trending-rail__title">
            <span className="home-trending-rail__live" aria-hidden />
            Trending now
          </h2>
          <p className="home-rail__desc text-gray-500">
            Most enrolled courses this week — hover to pause, click to start.
          </p>
        </div>
        <Link href="/courses" className="home-rail__link">
          Browse all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Infinite marquee */}
      <div className="home-trending-rail__stage -mx-1">
        <MarqueeRow
          duration={duration}
          gap={18}
          ariaLabel="Trending courses"
          className="home-trending-marquee"
        >
          {courses.map((c) => (
            <div key={c.id} className="course-trending-card-wrap">
              <HomeCourseCard
                slug={c.slug}
                title={c.title}
                thumbnailUrl={c.thumbnailUrl || null}
                instructorName={c.instructor.fullName}
                durationHours={c.durationHours}
                level={c.level}
                category={c.category}
                isFree={c.isFree}
                variant="trending"
              />

              {/* Learner count chip */}
              <div className="course-trending-learners">
                <span className="course-trending-learners__dot" />
                {c.totalEnrollments.toLocaleString()} enrolled
              </div>
            </div>
          ))}
        </MarqueeRow>
      </div>
    </section>
  );
}
