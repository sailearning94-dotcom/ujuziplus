import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeCarousel } from "@/components/home/HomeCarousel";

export function HomeCatalogRail({
  title,
  description,
  seeAllHref,
  seeAllLabel = "Show all",
  children,
  itemWidth = 280,
  autoScroll = false,
}: {
  title: string;
  description?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  children: React.ReactNode;
  itemWidth?: number;
  autoScroll?: boolean;
}) {
  return (
    <section className="home-rail">
      <div className="home-rail__header">
        <div className="home-rail__copy">
          <h2 className="home-rail__title">{title}</h2>
          {description && <p className="home-rail__desc">{description}</p>}
        </div>
        {seeAllHref && (
          <Link href={seeAllHref} className="home-rail__link">
            {seeAllLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <HomeCarousel itemWidth={itemWidth} autoScroll={autoScroll} speed={0.35}>
        {children}
      </HomeCarousel>
    </section>
  );
}
