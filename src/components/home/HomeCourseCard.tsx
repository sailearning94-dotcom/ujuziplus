import Image from "next/image";
import Link from "next/link";
import { Clock, User } from "lucide-react";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop";

export function HomeCourseCard({
  slug,
  title,
  thumbnailUrl,
  instructorName,
  durationHours,
  level,
  category,
  isFree,
  variant = "default",
}: {
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  instructorName: string;
  durationHours: number;
  level: string;
  category: string | null;
  isFree: boolean;
  variant?: "default" | "trending";
}) {
  return (
    <Link
      href={`/courses/${slug}`}
      className={`home-course-card group${variant === "trending" ? " home-course-card--trending" : ""}`}
    >
      <div className="home-course-card__media">
        <Image
          src={thumbnailUrl || PLACEHOLDER}
          alt=""
          fill
          className={
            variant === "trending"
              ? "object-cover"
              : "object-cover transition duration-500 group-hover:scale-[1.04]"
          }
          sizes="280px"
          unoptimized
        />
        <div className="home-course-card__overlay" />
        {category && <span className="home-course-card__category">{category}</span>}
        {isFree && <span className="home-course-card__free">Free</span>}
      </div>
      <div className="home-course-card__body">
        <h3 className="home-course-card__title">{title}</h3>
        <p className="home-course-card__instructor">
          <User className="h-3.5 w-3.5 shrink-0" />
          {instructorName}
        </p>
        <p className="home-course-card__meta">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          {durationHours}h · <span className="capitalize">{level.toLowerCase()}</span>
        </p>
      </div>
    </Link>
  );
}
