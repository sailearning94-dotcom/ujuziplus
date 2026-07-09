"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Users, Star, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { SerializedMentor } from "@/lib/actions/mentors";

const GAINS = [
  "Personalized guidance and feedback",
  "Real-world hands-on projects",
  "Confidence to compete and lead",
];

export function HomeMentorSpotlight({ mentor }: { mentor: SerializedMentor }) {
  const quote = mentor.quote ?? mentor.hook;
  const tags = mentor.expertiseTags.slice(0, 2);

  const stats = [
    mentor.studentsHelped > 0 && {
      icon: Users,
      value: `${mentor.studentsHelped}+`,
      label: "Learners Helped",
      color: "text-violet-600",
    },
    mentor.averageRating != null && mentor.ratingCount > 0 && {
      icon: Star,
      value: mentor.averageRating.toFixed(1),
      label: "Average Rating",
      color: "text-amber-500",
    },
    mentor.yearsExperience > 0 && {
      icon: Clock,
      value: `${mentor.yearsExperience}+`,
      label: "Years Mentoring",
      color: "text-blue-600",
    },
  ].filter(Boolean) as { icon: typeof Users; value: string; label: string; color: string }[];

  return (
    <section className="mentor-spotlight-v2" aria-label="Featured mentor">
      <span className="mentor-spotlight-v2__eyebrow">
        <Sparkles className="h-3 w-3" aria-hidden />
        Mentor spotlight
      </span>

      <div className="mentor-spotlight-v2__grid">
        {/* Left column */}
        <div className="mentor-spotlight-v2__left">
          <div className="mentor-spotlight-v2__identity">
            <Avatar
              src={mentor.avatarUrl}
              alt={mentor.displayName}
              size="md"
              ring
              status={mentor.isAcceptingRequests ? "online" : undefined}
            />
            <div className="min-w-0">
              {mentor.isAcceptingRequests && (
                <span className="mentor-spotlight-v2__available">
                  <span className="mentor-spotlight-v2__available-dot" aria-hidden />
                  Accepting requests
                </span>
              )}
              <h2 className="mentor-spotlight-v2__name">
                {mentor.displayName}
                {mentor.isFeatured && (
                  <BadgeCheck className="mentor-spotlight-v2__verified" aria-label="Featured mentor" />
                )}
              </h2>
              {(mentor.title || mentor.company) && (
                <p className="mentor-spotlight-v2__role">
                  {[mentor.title, mentor.company].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>

          {quote && (
            <blockquote className="mentor-spotlight-v2__quote">
              <p>{quote}</p>
            </blockquote>
          )}

          {tags.length > 0 && (
            <div className="mentor-spotlight-v2__tags">
              {tags.map((t) => (
                <span key={t} className="mentor-spotlight-v2__tag">{t}</span>
              ))}
            </div>
          )}

          {mentor.studentsHelped > 0 && (
            <div className="mentor-spotlight-v2__social">
              <span className="mentor-spotlight-v2__social-count" aria-hidden>
                {mentor.studentsHelped}+
              </span>
              <div>
                <p className="mentor-spotlight-v2__social-title">
                  {mentor.studentsHelped}+ learners helped
                </p>
                <p className="mentor-spotlight-v2__social-sub">Join learners building the future</p>
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="mentor-spotlight-v2__right">
          {stats.length > 0 && (
            <div className="mentor-spotlight-v2__stats">
              {stats.map((s) => (
                <div key={s.label} className="mentor-spotlight-v2__stat">
                  <s.icon className={`h-4 w-4 ${s.color}`} aria-hidden />
                  <span className="mentor-spotlight-v2__stat-value">{s.value}</span>
                  <span className="mentor-spotlight-v2__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mentor-spotlight-v2__gains">
            <p className="mentor-spotlight-v2__gains-title">What you&apos;ll gain</p>
            <ul>
              {GAINS.map((g) => (
                <li key={g}>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  {g}
                </li>
              ))}
            </ul>
          </div>

          <Button asChild size="md" className="w-full">
            <Link href={`/mentors/${mentor.slug}`}>
              View profile
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
