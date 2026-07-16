/**
 * Open Knowledge Resources catalog — coding tutorials, AI/IoT resources,
 * STEM teaching materials, open-source projects, innovation toolkits,
 * entrepreneurship guides, research publications, and digital learning
 * manuals, distinct from the hardware-focused Lab Resources catalog.
 */
"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import type { OpenKnowledgeCategory } from "@prisma/client";

const getOpenKnowledgeResourcesCached = unstable_cache(
  async (category?: OpenKnowledgeCategory) =>
    db.openKnowledgeResource.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ isFeatured: "desc" }, { title: "asc" }],
    }),
  ["open-knowledge-resources"],
  { revalidate: 60, tags: ["open-knowledge-resources"] }
);

export async function getOpenKnowledgeResources(category?: OpenKnowledgeCategory) {
  return getOpenKnowledgeResourcesCached(category);
}

const getOpenKnowledgeResourceBySlugCached = unstable_cache(
  async (slug: string) => db.openKnowledgeResource.findUnique({ where: { slug } }),
  ["open-knowledge-resource-by-slug"],
  { revalidate: 60, tags: ["open-knowledge-resources"] }
);

export async function getOpenKnowledgeResourceBySlug(slug: string) {
  return getOpenKnowledgeResourceBySlugCached(slug);
}

const getFeaturedOpenKnowledgeResourcesCached = unstable_cache(
  async (limit: number) =>
    db.openKnowledgeResource.findMany({
      where: { isFeatured: true },
      orderBy: { title: "asc" },
      take: limit,
    }),
  ["featured-open-knowledge-resources"],
  { revalidate: 60, tags: ["open-knowledge-resources"] }
);

export async function getFeaturedOpenKnowledgeResources(limit = 4) {
  return getFeaturedOpenKnowledgeResourcesCached(limit);
}
