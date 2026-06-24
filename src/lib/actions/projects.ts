/**
 * Innovation showcase projects
 */
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { ProjectStatus } from "@prisma/client";
import type { ActionResult } from "./courses";
import { requireUser, requireAdmin, assertSelfOrAdmin } from "@/lib/auth-server";

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "project"
  );
}

async function uniqueProjectSlug(title: string, excludeId?: string) {
  const base = slugify(title);
  let slug = base;
  let i = 0;
  while (true) {
    const existing = await db.project.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    i++;
    slug = `${base}-${i}`;
  }
  return slug;
}

export async function getPublishedProjects() {
  return db.project.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      creator: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
    },
  });
}

export async function getProjectBySlug(slug: string) {
  return db.project.findFirst({
    where: { slug, isPublished: true },
    include: {
      creator: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
    },
  });
}

export async function getUserProjects(userId: string) {
  const { user } = await requireUser();
  assertSelfOrAdmin(user.id, userId, user.role);

  return db.project.findMany({
    where: { creatorId: userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function hasUserLikedProject(userId: string, projectId: string) {
  const like = await db.projectLike.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });
  return !!like;
}

export async function createProject(
  userId: string,
  input: {
    title: string;
    description: string;
    category: string;
    tags?: string[];
    status?: ProjectStatus;
    githubUrl?: string;
    demoUrl?: string;
    thumbnailUrl?: string;
  }
): Promise<ActionResult<{ slug: string }>> {
  const { user } = await requireUser();
  assertSelfOrAdmin(user.id, userId, user.role);

  if (!input.title.trim() || !input.description.trim()) {
    return { success: false, error: "Title and description are required." };
  }

  const slug = await uniqueProjectSlug(input.title);
  const project = await db.project.create({
    data: {
      slug,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category.trim() || "General",
      tags: input.tags ?? [],
      status: input.status ?? "PROTOTYPE",
      githubUrl: input.githubUrl?.trim() || null,
      demoUrl: input.demoUrl?.trim() || null,
      thumbnailUrl: input.thumbnailUrl?.trim() || null,
      creatorId: userId,
      isPublished: true,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard/projects");
  return { success: true, data: { slug: project.slug } };
}

export async function toggleProjectLike(
  userId: string,
  projectId: string
): Promise<ActionResult<{ liked: boolean }>> {
  const { user } = await requireUser();
  assertSelfOrAdmin(user.id, userId, user.role);

  const existing = await db.projectLike.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (existing) {
    await db.$transaction([
      db.projectLike.delete({ where: { id: existing.id } }),
      db.project.update({
        where: { id: projectId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);
    revalidatePath("/projects");
    return { success: true, data: { liked: false } };
  }

  await db.$transaction([
    db.projectLike.create({ data: { userId, projectId } }),
    db.project.update({
      where: { id: projectId },
      data: { likesCount: { increment: 1 } },
    }),
  ]);
  revalidatePath("/projects");
  return { success: true, data: { liked: true } };
}

export async function getAdminProjects() {
  await requireAdmin();
  return db.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { creator: { select: { fullName: true, email: true } } },
  });
}

export async function adminToggleProjectPublished(
  projectId: string,
  isPublished: boolean
): Promise<ActionResult> {
  await requireAdmin();
  await db.project.update({ where: { id: projectId }, data: { isPublished } });
  revalidatePath("/admin/content");
  revalidatePath("/projects");
  return { success: true, data: undefined };
}
