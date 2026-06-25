"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Package,
  Rocket,
  Trophy,
  Clock,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { MarqueeRow } from "@/components/home/MarqueeRow";
import type { DiscoveryItem } from "@/components/home/discovery";

export type { DiscoveryItem };

const KIND_CONFIG = {
  course: { label: "Course", icon: BookOpen, accent: "course" },
  kit: { label: "Kit", icon: Package, accent: "kit" },
  program: { label: "Bootcamp", icon: Rocket, accent: "program" },
  competition: { label: "Competition", icon: Trophy, accent: "competition" },
} as const;

function DiscoveryCard({ item }: { item: DiscoveryItem }) {
  const cfg = KIND_CONFIG[item.kind];
  const Icon = cfg.icon;

  return (
    <Link
      href={item.href}
      className={`discovery-card discovery-card--${cfg.accent} group`}
    >
      <div className="discovery-card__media">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt=""
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.06]"
            sizes="280px"
            unoptimized
          />
        ) : (
          <div className="discovery-card__media-fallback">
            <Icon className="h-10 w-10" strokeWidth={1.25} />
          </div>
        )}
        <div className="discovery-card__media-overlay" />
        <span className="discovery-card__badge">
          <Icon className="h-3 w-3" />
          {cfg.label}
        </span>
        {item.highlight && (
          <span className="discovery-card__highlight">{item.highlight}</span>
        )}
      </div>

      <div className="discovery-card__body">
        <h3 className="discovery-card__title">{item.title}</h3>
        <p className="discovery-card__meta">
          {item.metaPrimary}
          {item.metaSecondary && (
            <>
              <span className="mx-1.5 text-gray-300">·</span>
              {item.metaSecondary}
            </>
          )}
        </p>
        <span className="discovery-card__cta">
          Explore
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function HomeDiscoveryMarquee({ items }: { items: DiscoveryItem[] }) {
  if (items.length < 4) return null;

  // Two counter-scrolling rows when there's enough content; one row otherwise.
  const splitPoint = Math.ceil(items.length / 2);
  const useTwoRows = items.length >= 10;
  const rowA = useTwoRows ? items.slice(0, splitPoint) : items;
  const rowB = useTwoRows ? items.slice(splitPoint) : [];

  return (
    <section className="discovery-section" aria-label="Live on UjuziLab">
      <div className="discovery-section__head">
        <p className="discovery-section__eyebrow">
          <span className="discovery-section__pulse" aria-hidden />
          Live on UjuziLab
        </p>
        <h2 className="discovery-section__title">
          Courses, kits, bootcamps &amp; competitions — all in one place
        </h2>
        <p className="discovery-section__desc">
          A moving snapshot of everything happening across the platform right now.
        </p>
      </div>

      <MarqueeRow duration={Math.max(45, rowA.length * 7)} ariaLabel="Featured catalog">
        {rowA.map((item) => (
          <DiscoveryCard key={item.key} item={item} />
        ))}
      </MarqueeRow>

      {rowB.length >= 4 && (
        <div className="mt-5">
          <MarqueeRow
            direction="right"
            duration={Math.max(50, rowB.length * 8)}
            ariaLabel="More from the catalog"
          >
            {rowB.map((item) => (
              <DiscoveryCard key={item.key} item={item} />
            ))}
          </MarqueeRow>
        </div>
      )}

      <div className="discovery-section__links">
        <Link href="/courses">All courses</Link>
        <span aria-hidden>·</span>
        <Link href="/kits">All kits</Link>
        <span aria-hidden>·</span>
        <Link href="/programs">All programs</Link>
        <span aria-hidden>·</span>
        <Link href="/competitions">Competitions</Link>
      </div>
    </section>
  );
}

export function OrgMarqueeItem({
  name,
  logoUrl,
  type,
  isVerified,
  memberCount,
}: {
  name: string;
  logoUrl: string | null;
  type: string;
  isVerified: boolean;
  memberCount: number;
}) {
  const monogram = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="org-chip" title={name}>
      <span className="org-chip__logo">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt=""
            width={48}
            height={48}
            className="h-11 w-11 rounded-xl object-cover sm:h-12 sm:w-12"
            unoptimized
          />
        ) : (
          <span className="org-chip__monogram">{monogram}</span>
        )}
      </span>
      <span className="min-w-0">
        <span className="org-chip__name">
          {name}
          {isVerified && <span className="org-chip__verified" title="Verified">✓</span>}
        </span>
        <span className="org-chip__meta">
          {type.toLowerCase().replace(/_/g, " ")}
          {memberCount > 0 && (
            <>
              {" · "}
              <Users className="inline h-3 w-3 -mt-px" /> {memberCount}
            </>
          )}
        </span>
      </span>
    </div>
  );
}

export function OrgMarquee({
  orgs,
}: {
  orgs: {
    id: string;
    name: string;
    logoUrl: string | null;
    type: string;
    isVerified: boolean;
    memberCount: number;
  }[];
}) {
  if (orgs.length < 3) return null;

  return (
    <section className="org-marquee-section" aria-label="Partner organizations">
      <p className="org-marquee-section__label">
        Trusted by schools, universities &amp; innovation hubs across Africa
      </p>
      <MarqueeRow direction="right" duration={Math.max(35, orgs.length * 6)} gap={20}>
        {orgs.map((org) => (
          <OrgMarqueeItem
            key={org.id}
            name={org.name}
            logoUrl={org.logoUrl}
            type={org.type}
            isVerified={org.isVerified}
            memberCount={org.memberCount}
          />
        ))}
      </MarqueeRow>
      <div className="org-marquee-section__cta">
        <Link href="/organizations">Explore organizations →</Link>
      </div>
    </section>
  );
}
