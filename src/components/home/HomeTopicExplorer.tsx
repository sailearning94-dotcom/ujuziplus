"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bot,
  Radio,
  Code2,
  Smartphone,
  BarChart3,
  Shield,
  Lightbulb,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { getCategoryImageUrl } from "@/lib/home-category-images";
import { MarqueeRow } from "@/components/home/MarqueeRow";

const TOPIC_ICONS: Record<string, LucideIcon> = {
  "AI & Machine Learning": Cpu,
  Robotics: Bot,
  IoT: Radio,
  "Web Development": Code2,
  "Mobile Development": Smartphone,
  "Data Science": BarChart3,
  Cybersecurity: Shield,
  Entrepreneurship: Lightbulb,
};

function TopicCard({ category }: { category: (typeof CATEGORIES)[number] }) {
  const Icon = TOPIC_ICONS[category] ?? Cpu;

  return (
    <Link
      href={`/courses?category=${encodeURIComponent(category)}`}
      className="home-topic-card group"
    >
      <Image
        src={getCategoryImageUrl(category)}
        alt=""
        fill
        className="home-topic-card__image object-cover transition duration-700 ease-out group-hover:scale-[1.08]"
        sizes="220px"
      />
      <div className="home-topic-card__shade" aria-hidden />
      <span className="home-topic-card__icon">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="home-topic-card__label">{category}</span>
    </Link>
  );
}

export function HomeTopicExplorer() {
  return (
    <section className="home-topics" aria-label="Browse by topic">
      <div className="home-topics__head">
        <h2 className="home-topics__title">Explore top categories</h2>
        <Link href="/courses" className="home-topics__link">
          View all topics
        </Link>
      </div>

      <div className="home-topics__marquee">
        <MarqueeRow
          duration={42}
          gap={14}
          ariaLabel="STEM categories"
          className="home-topics__marquee-track"
        >
          {CATEGORIES.map((category) => (
            <TopicCard key={category} category={category} />
          ))}
        </MarqueeRow>
      </div>
    </section>
  );
}
