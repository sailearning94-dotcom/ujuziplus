import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeCarousel } from "@/components/home/HomeCarousel";
import { SciFiHeading } from "@/components/home/SciFiHeading";

export function HomeCatalogRail({
  title,
  description,
  seeAllHref,
  seeAllLabel = "Show all",
  children,
  itemWidth = 280,
  autoScroll = false,
  layout = "carousel",
}: {
  title: string;
  description?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  children: React.ReactNode;
  itemWidth?: number;
  autoScroll?: boolean;
  /** "grid" wraps all cards in a responsive grid instead of a scrollable carousel. */
  layout?: "carousel" | "grid";
}) {
  return (
    <section className="home-rail">
      <div className="home-rail__header">
        <div className="home-rail__copy">
          <h2 className="home-rail__title">
            <SciFiHeading text={title} />
          </h2>
          {description && <p className="home-rail__desc">{description}</p>}
        </div>
        {seeAllHref && (
          <Link href={seeAllHref} className="home-rail__link">
            {seeAllLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {layout === "grid" ? (
        <div className="home-rail-grid">{children}</div>
      ) : (
        <HomeCarousel itemWidth={itemWidth} autoScroll={autoScroll} speed={0.35}>
          {children}
        </HomeCarousel>
      )}
    </section>
  );
}
