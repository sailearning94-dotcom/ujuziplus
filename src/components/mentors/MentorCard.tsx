"use client";

import Link from "next/link";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { SerializedMentor } from "@/lib/actions/mentors";
import { cn } from "@/lib/utils";

const MENTOR_TYPE_LABEL: Record<string, string> = {
  ACADEMIC: "Academic",
  INDUSTRY: "Industry",
  INNOVATION: "Innovation",
  GENERAL: "",
};

const MENTOR_TYPE_CLASS: Record<string, string> = {
  ACADEMIC: "bg-blue-50 text-blue-700 border-blue-200",
  INDUSTRY: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INNOVATION: "bg-violet-50 text-violet-700 border-violet-200",
  GENERAL: "",
};

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
      <span className="text-gray-400 font-normal">({count})</span>
    </span>
  );
}

export function MentorCard({
  mentor,
  variant = "grid",
  className,
}: {
  mentor: SerializedMentor;
  variant?: "grid" | "marquee" | "spotlight";
  className?: string;
}) {
  const tags = mentor.expertiseTags.slice(0, 3);
  const typeLabel = MENTOR_TYPE_LABEL[mentor.mentorType ?? "GENERAL"];
  const typeClass = MENTOR_TYPE_CLASS[mentor.mentorType ?? "GENERAL"];

  return (
    <Link
      href={`/mentors/${mentor.slug}`}
      className={cn(
        "mentor-card group block",
        variant === "marquee" && "mentor-card--marquee",
        variant === "spotlight" && "mentor-card--spotlight",
        variant === "grid" && "mentor-card--grid",
        className
      )}
    >
      <div className="mentor-card__glow" aria-hidden />
      <div className="mentor-card__inner">
        <div className="mentor-card__avatar-wrap">
          <Avatar
            src={mentor.avatarUrl}
            alt={mentor.displayName}
            size={variant === "spotlight" ? "xl" : "lg"}
            ring
            className={cn(
              "mentor-card__avatar",
              mentor.isAcceptingRequests && "mentor-card__avatar--available"
            )}
          />
          {mentor.isFeatured && (
            <span className="mentor-card__featured" title="Featured mentor" aria-label="Featured mentor">
              <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
            </span>
          )}
        </div>

        <div className="mentor-card__body">
          <div className="flex items-start gap-2 flex-wrap mb-0.5">
            <h3 className="mentor-card__name">{mentor.displayName}</h3>
            {typeLabel && (
              <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", typeClass)}>
                {typeLabel}
              </span>
            )}
          </div>

          {mentor.title && (
            <p className="mentor-card__title">
              {mentor.title}
              {mentor.company ? ` · ${mentor.company}` : ""}
            </p>
          )}
          {mentor.hook && <p className="mentor-card__hook">{mentor.hook}</p>}

          {tags.length > 0 && (
            <div className="mentor-card__tags">
              {tags.map((t) => (
                <Badge key={t} variant="outline" size="sm">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          <div className="mentor-card__meta">
            {(mentor.city || mentor.country) && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                {[mentor.city, mentor.country].filter(Boolean).join(", ")}
              </span>
            )}
            {mentor.averageRating != null && mentor.ratingCount > 0 ? (
              <StarRating rating={mentor.averageRating} count={mentor.ratingCount} />
            ) : mentor.studentsHelped > 0 ? (
              <span className="text-xs text-brand font-medium">
                Helped {mentor.studentsHelped}+ learners
              </span>
            ) : null}
          </div>

          <span className="mentor-card__cta">View learning path →</span>
        </div>
      </div>
    </Link>
  );
}
