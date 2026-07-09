"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Users, Star, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
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
      tone: "mentor-spotlight-v3__stat-icon--violet",
    },
    mentor.averageRating != null && mentor.ratingCount > 0 && {
      icon: Star,
      value: mentor.averageRating.toFixed(1),
      label: "Average Rating",
      tone: "mentor-spotlight-v3__stat-icon--amber",
    },
    mentor.yearsExperience > 0 && {
      icon: Clock,
      value: `${mentor.yearsExperience}+`,
      label: "Years Mentoring",
      tone: "mentor-spotlight-v3__stat-icon--sky",
    },
  ].filter(Boolean) as { icon: typeof Users; value: string; label: string; tone: string }[];

  return (
    <section className="mentor-spotlight-v3" aria-label="Featured mentor">
      <span className="mentor-spotlight-v3__eyebrow">
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        Mentor spotlight
      </span>

      <div className="mentor-spotlight-v3__grid">
        {/* Left column — identity & story */}
        <div className="mentor-spotlight-v3__left">
          <div className="mentor-spotlight-v3__identity">
            <span className="mentor-spotlight-v3__avatar-ring">
              <Avatar
                src={mentor.avatarUrl}
                alt={mentor.displayName}
                size="lg"
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
            </div>
          </div>

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

          {mentor.studentsHelped > 0 && (
            <div className="mentor-spotlight-v3__social">
              <span className="mentor-spotlight-v3__social-count" aria-hidden>
                {mentor.studentsHelped}+
              </span>
              <div>
                <p className="mentor-spotlight-v3__social-title">
                  {mentor.studentsHelped}+ learners helped
                </p>
                <p className="mentor-spotlight-v3__social-sub">Join learners building the future</p>
              </div>
            </div>
          )}
        </div>

        {/* Right column — proof & action */}
        <div className="mentor-spotlight-v3__right">
          {stats.length > 0 && (
            <div className="mentor-spotlight-v3__stats">
              {stats.map((s) => (
                <div key={s.label} className="mentor-spotlight-v3__stat">
                  <span className={`mentor-spotlight-v3__stat-icon ${s.tone}`}>
                    <s.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="mentor-spotlight-v3__stat-value">{s.value}</span>
                  <span className="mentor-spotlight-v3__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mentor-spotlight-v3__gains">
            <p className="mentor-spotlight-v3__gains-title">What you&apos;ll gain</p>
            <ul>
              {GAINS.map((g) => (
                <li key={g}>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  {g}
                </li>
              ))}
            </ul>
          </div>

          <Link href={`/mentors/${mentor.slug}`} className="mentor-spotlight-v3__cta">
            View profile
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
