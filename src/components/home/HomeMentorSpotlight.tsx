"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { SerializedMentor } from "@/lib/actions/mentors";

export function HomeMentorSpotlight({ mentor }: { mentor: SerializedMentor }) {
  const quote = mentor.quote ?? mentor.hook;

  return (
    <section className="mentor-spotlight" aria-label="Featured mentor">
      <div className="mentor-spotlight__inner">

        {/* Top row: avatar + meta */}
        <div className="mentor-spotlight__top">
          <Avatar
            src={mentor.avatarUrl}
            alt={mentor.displayName}
            size="lg"
            ring
            ringTone="dark"
          />

          <div className="mentor-spotlight__meta">
            <p className="mentor-spotlight__eyebrow">Mentor spotlight</p>
            {mentor.isAcceptingRequests && (
              <span className="mentor-spotlight__available">Accepting requests</span>
            )}
            {mentor.studentsHelped > 0 && (
              <p className="mentor-spotlight__stat">
                <strong>{mentor.studentsHelped}+</strong> learners helped
              </p>
            )}
          </div>
        </div>

        {/* Name + role */}
        <h2 className="mentor-spotlight__name">{mentor.displayName}</h2>
        {(mentor.title || mentor.company) && (
          <p className="mentor-spotlight__role">
            {[mentor.title, mentor.company].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Quote */}
        {quote && (
          <blockquote className="mentor-spotlight__quote">
            <p>{quote}</p>
          </blockquote>
        )}

        {/* Footer: tags + CTA */}
        <div className="mentor-spotlight__footer">
          {mentor.tracks.length > 0 && (
            <div className="mentor-spotlight__tags">
              {mentor.tracks.slice(0, 3).map((t) => (
                <span key={t} className="mentor-spotlight__tag">{t}</span>
              ))}
            </div>
          )}
          <Button asChild size="lg">
            <Link href={`/mentors/${mentor.slug}`}>
              View learning path
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
