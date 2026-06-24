/**
 * Organization kit inventory & procurement requests
 */
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { OrgKitRequestStatus } from "@prisma/client";
import type { ActionResult } from "./courses";
import { requireUser, requireAdmin } from "@/lib/auth-server";
import { createNotification } from "@/lib/actions/notifications";
import { sendEmail, orgKitRequestAdminEmail } from "@/lib/email";

async function requireOrgMember(orgSlug: string, userId: string, roles?: ("ADMIN" | "INSTRUCTOR")[]) {
  const org = await db.organization.findUnique({ where: { slug: orgSlug } });
  if (!org) return { ok: false as const, error: "Organization not found." };

  const member = await db.organizationMember.findUnique({
    where: { orgId_userId: { orgId: org.id, userId } },
  });
  if (!member) return { ok: false as const, error: "You are not a member of this organization." };
  if (roles && !roles.includes(member.role as "ADMIN" | "INSTRUCTOR")) {
    return { ok: false as const, error: "Insufficient permissions." };
  }
  return { ok: true as const, org, member };
}

export async function getOrganizationBySlug(slug: string) {
  return db.organization.findUnique({ where: { slug } });
}

export async function getOrgKitInventory(orgSlug: string) {
  const org = await db.organization.findUnique({ where: { slug: orgSlug } });
  if (!org) return [];

  return db.orgKitInventory.findMany({
    where: { orgId: org.id },
    include: { kit: { select: { slug: true, title: true, thumbnailUrl: true } } },
    orderBy: { kit: { title: "asc" } },
  });
}

export async function getOrgKitRequests(orgSlug: string) {
  const org = await db.organization.findUnique({ where: { slug: orgSlug } });
  if (!org) return [];

  return db.orgKitRequest.findMany({
    where: { orgId: org.id },
    include: {
      kit: { select: { slug: true, title: true } },
      requester: { select: { fullName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublishedKitsForRequest() {
  return db.kit.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, slug: true, title: true },
    orderBy: { title: "asc" },
  });
}

export async function submitOrgKitRequest(
  userId: string,
  orgSlug: string,
  input: { kitId: string; quantity: number; notes?: string }
): Promise<ActionResult> {
  const { user } = await requireUser();
  if (user.id !== userId && user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized." };
  }

  const access = await requireOrgMember(orgSlug, userId);
  if (!access.ok) return { success: false, error: access.error };

  const kit = await db.kit.findFirst({
    where: { id: input.kitId, status: "PUBLISHED" },
  });
  if (!kit) return { success: false, error: "Kit not found." };

  if (input.quantity < 1) return { success: false, error: "Quantity must be at least 1." };

  const req = await db.orgKitRequest.create({
    data: {
      orgId: access.org.id,
      kitId: kit.id,
      requesterId: userId,
      quantity: input.quantity,
      notes: input.notes?.trim() ?? null,
    },
    include: {
      org: { select: { name: true, slug: true } },
      requester: { select: { fullName: true } },
    },
  });

  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const orgReviewUrl = `${base}/org/${orgSlug}/kits`;

  const orgAdmins = await db.organizationMember.findMany({
    where: { orgId: access.org.id, role: "ADMIN" },
    include: { user: { select: { id: true, email: true, fullName: true } } },
  });

  for (const { user: orgAdmin } of orgAdmins) {
    await createNotification(orgAdmin.id, {
      type: "SYSTEM",
      title: "Kit request needs review",
      message: `${req.requester.fullName} requested ${input.quantity}× ${kit.title}.`,
      href: orgReviewUrl,
      prefCategory: "Course updates",
    });

    const emailResult = await sendEmail({
      to: orgAdmin.email,
      subject: `[${access.org.name}] New kit request: ${kit.title}`,
      html: orgKitRequestAdminEmail({
        adminName: orgAdmin.fullName,
        orgName: access.org.name,
        requesterName: req.requester.fullName,
        kitTitle: kit.title,
        quantity: input.quantity,
        notes: input.notes,
        reviewUrl: orgReviewUrl,
      }),
    });
    if (!emailResult.ok) {
      console.error("Org kit request admin email failed:", emailResult.error);
    }
  }

  revalidatePath(`/org/${orgSlug}/kits`);
  revalidatePath("/admin/kit-requests");
  return { success: true, data: undefined };
}

export async function updateOrgKitRequestStatus(
  orgSlug: string,
  requestId: string,
  status: OrgKitRequestStatus,
  actorUserId: string
): Promise<ActionResult> {
  const { user } = await requireUser();
  if (user.id !== actorUserId) {
    return { success: false, error: "Unauthorized." };
  }

  const access = await requireOrgMember(orgSlug, actorUserId, ["ADMIN"]);
  if (!access.ok) return { success: false, error: access.error };

  const org = await db.organization.findUnique({ where: { slug: orgSlug } });
  if (!org) return { success: false, error: "Organization not found." };

  const req = await db.orgKitRequest.findFirst({
    where: { id: requestId, orgId: org.id },
    include: { kit: true, requester: true, org: true },
  });
  if (!req) return { success: false, error: "Request not found." };

  await db.orgKitRequest.update({
    where: { id: requestId },
    data: { status },
  });

  if (status === "FULFILLED") {
    await db.orgKitInventory.upsert({
      where: { orgId_kitId: { orgId: org.id, kitId: req.kitId } },
      create: {
        orgId: org.id,
        kitId: req.kitId,
        quantityOnHand: req.quantity,
        quantityAllocated: 0,
      },
      update: { quantityOnHand: { increment: req.quantity } },
    });
  }

  const statusLabel = status.toLowerCase().replace("_", " ");
  await createNotification(req.requesterId, {
    type: "SYSTEM",
    title: `Kit request ${statusLabel}`,
    message: `Your request for ${req.quantity}× ${req.kit.title} at ${req.org.name} was ${statusLabel}.`,
    href: `/org/${orgSlug}/kits`,
    prefCategory: "Course updates",
  });

  revalidatePath(`/org/${orgSlug}/kits`);
  revalidatePath("/admin/kit-requests");
  return { success: true, data: undefined };
}

export async function adjustOrgKitInventory(
  orgSlug: string,
  inventoryId: string,
  patch: { quantityOnHand?: number; quantityAllocated?: number },
  actorUserId: string
): Promise<ActionResult> {
  const access = await requireOrgMember(orgSlug, actorUserId, ["ADMIN"]);
  if (!access.ok) return { success: false, error: access.error };

  const row = await db.orgKitInventory.findFirst({
    where: { id: inventoryId, orgId: access.org.id },
  });
  if (!row) return { success: false, error: "Inventory row not found." };

  await db.orgKitInventory.update({
    where: { id: inventoryId },
    data: {
      quantityOnHand: patch.quantityOnHand ?? row.quantityOnHand,
      quantityAllocated: patch.quantityAllocated ?? row.quantityAllocated,
    },
  });

  revalidatePath(`/org/${orgSlug}/kits`);
  return { success: true, data: undefined };
}

// ─── Platform admin: all pending requests ─────────────────────────────────────

export async function getAdminOrgKitRequests() {
  await requireAdmin();
  return db.orgKitRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      org: { select: { slug: true, name: true } },
      kit: { select: { slug: true, title: true } },
      requester: { select: { fullName: true, email: true } },
    },
  });
}

/** Optional read for public pages — never throws for guests or stale sessions. */
export async function getUserOrganizations(userId: string) {
  const { getAuthSession } = await import("@/lib/auth-server");
  const session = await getAuthSession();
  if (!session?.user?.id) return [];
  if (session.user.id !== userId && session.user.role !== "ADMIN") return [];

  return db.organizationMember.findMany({
    where: { userId },
    include: { org: true },
  });
}
