/**
 * Blog posts
 */
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { BlogPostStatus } from "@prisma/client";
import type { ActionResult } from "./courses";
import { requireAdmin } from "@/lib/auth-server";

export async function getPublishedBlogPosts() {
  return db.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { fullName: true } } },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return db.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { author: { select: { fullName: true, avatarUrl: true } } },
  });
}

export async function getAdminBlogPosts() {
  await requireAdmin();
  return db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { fullName: true } } },
  });
}

export async function adminUpsertBlogPost(input: {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  body: string;
  category: string;
  status: BlogPostStatus;
  authorId?: string;
}): Promise<ActionResult> {
  await requireAdmin();

  const publishedAt =
    input.status === "PUBLISHED" ? new Date() : undefined;

  const data = {
    slug: input.slug.trim(),
    title: input.title.trim(),
    excerpt: input.excerpt?.trim() ?? null,
    body: input.body.trim(),
    category: input.category.trim(),
    status: input.status,
    authorId: input.authorId ?? null,
    ...(input.status === "PUBLISHED" ? { publishedAt } : {}),
  };

  if (input.id) {
    await db.blogPost.update({ where: { id: input.id }, data });
  } else {
    await db.blogPost.create({ data: { ...data, publishedAt: publishedAt ?? null } });
  }

  revalidatePath("/admin/content");
  revalidatePath("/blog");
  return { success: true, data: undefined };
}
