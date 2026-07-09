"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { SerializedMentor } from "@/lib/actions/mentors";

export function HomeMentorSpotlight({ mentor }: { mentor: SerializedMentor }) {
  const quote = mentor.quote ?? mentor.hook;
  const tags = mentor.expertiseTags.slice(0, 2);

  return (
    <section className="mentor-spotlight-v3" aria-label="Featured mentor">
      <span className="mentor-spotlight-v3__eyebrow">
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        Mentor spotlight
      </span>

      <div className="mentor-spotlight-v3__row">
        <div className="mentor-spotlight-v3__main">
          <div className="mentor-spotlight-v3__identity">
            <span className="mentor-spotlight-v3__avatar-ring">
              <Avatar
                src={mentor.avatarUrl}
                alt={mentor.displayName}
                size="md"
                status={mentor.isAcceptingRequests ? "online" : undefined}
              />
            </span>
            <div className="min-w-0">
              {mentor.isAcceptingRequests && (
                <span className="mentor-spotlight-v3__available">
                  <span className="mentor-spotlight-v3__available-dot" aria-hidden />
                  Accepting requests
                </span>
              )}
              {mentor.studentsHelped > 0 && (
                <p className="mentor-spotlight-v3__social-sub">
                  {mentor.studentsHelped}+ learners helped
                </p>
              )}
            </div>
          </div>

          <h2 className="mentor-spotlight-v3__name">
            {mentor.displayName}
            {mentor.isFeatured && (
              <BadgeCheck className="mentor-spotlight-v3__verified" aria-label="Featured mentor" />
            )}
          </h2>
          {(mentor.title || mentor.company) && (
            <p className="mentor-spotlight-v3__role">
              {[mentor.title, mentor.company].filter(Boolean).join(" · ")}
            </p>
          )}

          {quote && (
            <blockquote className="mentor-spotlight-v3__quote">
              <p>{quote}</p>
            </blockquote>
          )}

          {tags.length > 0 && (
            <div className="mentor-spotlight-v3__tags">
              {tags.map((t) => (
                <span key={t} className="mentor-spotlight-v3__tag">{t}</span>
              ))}
            </div>
          )}
        </div>

        <Link href={`/mentors/${mentor.slug}`} className="mentor-spotlight-v3__cta">
          View profile
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
