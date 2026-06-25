/**
 * Lab resources catalog & user bookmarks
 */
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { LabResourceType } from "@prisma/client";
import type { ActionResult } from "./courses";
import { requireUser, requireAdmin, assertSelfOrAdmin } from "@/lib/auth-server";

export async function getLabResources(type?: LabResourceType) {
  return db.labResource.findMany({
    where: type ? { type } : undefined,
    orderBy: { title: "asc" },
  });
}

export async function getLabResourceBySlug(slug: string) {
  return db.labResource.findUnique({ where: { slug } });
}

export async function getUserLabResourceIds(userId: string) {
  const { user } = await requireUser();
  assertSelfOrAdmin(user.id, userId, user.role);

  const rows = await db.userLabResource.findMany({
    where: { userId },
    select: { labResourceId: true },
  });
  return rows.map((r) => r.labResourceId);
}

export async function getUserSavedLabResources(userId: string) {
  const { user } = await requireUser();
  assertSelfOrAdmin(user.id, userId, user.role);

  return db.userLabResource.findMany({
    where: { userId },
    include: { labResource: true },
    orderBy: { savedAt: "desc" },
  });
}

export async function toggleLabResourceBookmark(
  userId: string,
  labResourceId: string
): Promise<ActionResult<{ saved: boolean }>> {
  const { user } = await requireUser();
  assertSelfOrAdmin(user.id, userId, user.role);

  const existing = await db.userLabResource.findUnique({
    where: { userId_labResourceId: { userId, labResourceId } },
  });

  if (existing) {
    await db.userLabResource.delete({ where: { id: existing.id } });
    revalidatePath("/lab-resources");
    revalidatePath("/dashboard/resources");
    return { success: true, data: { saved: false } };
  }

  await db.userLabResource.create({ data: { userId, labResourceId } });
  revalidatePath("/lab-resources");
  revalidatePath("/dashboard/resources");
  return { success: true, data: { saved: true } };
}

export async function getAdminLabResources() {
  await requireAdmin();
  return db.labResource.findMany({ orderBy: { title: "asc" } });
}

export async function adminUpsertLabResource(input: {
  id?: string;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  type: LabResourceType;
  category?: string;
  fileUrl?: string;
  pdfUrls?: string[];
  imageUrls?: string[];
  thumbnailUrl?: string | null;
  externalUrl?: string;
}): Promise<ActionResult<{ slug: string }>> {
  await requireAdmin();

  const data = {
    slug: input.slug.trim(),
    title: input.title.trim(),
    description: input.description?.trim() ?? null,
    content: input.content?.trim() || null,
    type: input.type,
    category: input.category?.trim() ?? null,
    fileUrl: input.fileUrl?.trim() || null,
    pdfUrls: input.pdfUrls ?? [],
    imageUrls: input.imageUrls ?? [],
    thumbnailUrl: input.thumbnailUrl ?? null,
    externalUrl: input.externalUrl?.trim() || null,
  };

  if (input.id) {
    await db.labResource.update({ where: { id: input.id }, data });
  } else {
    await db.labResource.create({ data });
  }

  revalidatePath("/admin/content");
  revalidatePath("/lab-resources");
  revalidatePath(`/lab-resources/${data.slug}`);
  return { success: true, data: { slug: data.slug } };
}
