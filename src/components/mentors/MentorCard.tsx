import { BadgeCheck, MapPin, Star, Clock } from "lucide-react";
import { MediaCard, Badge } from "@/components/shared/MediaCard";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import type { SerializedMentor } from "@/lib/actions/mentors";

const MENTOR_TYPE_LABEL: Record<string, string> = {
  ACADEMIC: "Academic",
  INDUSTRY: "Industry",
  INNOVATION: "Innovation",
  GENERAL: "",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function MentorCard({
  mentor,
  variant = "grid",
}: {
  mentor: SerializedMentor;
  variant?: "grid" | "marquee" | "spotlight";
}) {
  const tags = mentor.expertiseTags.slice(0, 3);
  const typeLabel = MENTOR_TYPE_LABEL[mentor.mentorType ?? "GENERAL"];

  return (
    <MediaCard
      href={`/mentors/${mentor.slug}`}
      aspect="video"
      className={variant === "marquee" ? "w-[280px] shrink-0" : undefined}
      title={mentor.displayName}
      subtitle={mentor.hook ?? ([mentor.title, mentor.company].filter(Boolean).join(" · ") || undefined)}
      badges={
        <>
          {typeLabel && (
            <Badge variant="outline" size="sm">{typeLabel}</Badge>
          )}
          {mentor.isAcceptingRequests && (
            <Badge variant="success" size="sm">Open for requests</Badge>
          )}
        </>
      }
      image={
        mentor.avatarUrl ? (
          <OptimizedImage
            src={mentor.avatarUrl}
            alt={mentor.displayName}
            fill
            className="object-top"
            sizes="(max-width: 768px) 50vw, 280px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-light to-orange-100 text-3xl font-bold text-brand">
            {initials(mentor.displayName)}
          </div>
        )
      }
      meta={
        <>
          {(mentor.title || mentor.company) && (
            <span className="w-full text-gray-600 font-medium line-clamp-1">
              {[mentor.title, mentor.company].filter(Boolean).join(" · ")}
            </span>
          )}
          {mentor.yearsExperience > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {mentor.yearsExperience}+ yrs
            </span>
          )}
          {(mentor.city || mentor.country) && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {[mentor.city, mentor.country].filter(Boolean).join(", ")}
            </span>
          )}
          {tags.length > 0 && (
            <div className="mt-1 flex w-full flex-wrap gap-1.5">
              {tags.map((t) => (
                <Badge key={t} variant="muted" size="sm">{t}</Badge>
              ))}
            </div>
          )}
        </>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          {mentor.averageRating != null && mentor.ratingCount > 0 ? (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {mentor.averageRating.toFixed(1)}
              <span className="text-gray-400 font-normal">({mentor.ratingCount})</span>
            </span>
          ) : mentor.isFeatured ? (
            <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
              <BadgeCheck className="h-3.5 w-3.5 text-brand" />
              Featured mentor
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex h-9 shrink-0 items-center rounded-lg border-2 border-brand/70 px-4 text-xs font-semibold text-brand transition-colors group-hover:bg-brand-light">
            View profile
          </span>
        </div>
      }
    />
  );
}
