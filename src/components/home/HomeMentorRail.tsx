"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarqueeRow } from "@/components/home/MarqueeRow";
import { MentorCard } from "@/components/mentors/MentorCard";
import type { SerializedMentor } from "@/lib/actions/mentors";

export function HomeMentorRail({ mentors }: { mentors: SerializedMentor[] }) {
  const peek = mentors.slice(0, 10);
  if (peek.length === 0) return null;

  const duration = Math.max(40, peek.length * 8);

  return (
    <section className="home-rail home-mentor-rail" aria-label="Industry mentors">
      <div className="home-rail__header">
        <div className="home-rail__copy">
          <h2 className="home-mentor-rail__title">
            <span className="home-mentor-rail__pulse" aria-hidden />
            Learn from industry builders
          </h2>
          <p className="home-rail__desc">
            Practitioners who guide what to learn next — robotics, IoT, coding &amp; more.
          </p>
        </div>
        <Link href="/mentors" className="home-rail__link">
          All mentors
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="home-mentor-rail__stage">
        <MarqueeRow
          duration={duration}
          gap={20}
          ariaLabel="Featured mentors"
          className="home-mentor-marquee"
        >
          {peek.map((m) => (
            <MentorCard key={m.id} mentor={m} variant="marquee" />
          ))}
        </MarqueeRow>
      </div>
    </section>
  );
}
