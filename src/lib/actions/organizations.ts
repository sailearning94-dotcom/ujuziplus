/**
 * Organization directory, admin CRUD, and org-scoped analytics
 */
"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import type { OrgType } from "@prisma/client";
import type { ActionResult } from "./courses";
import { requireUser, requireAdmin } from "@/lib/auth-server";
import { sendEmail, orgAdminCredentialsEmail } from "@/lib/email";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";

const APP_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

async function requireOrgAdmin(orgSlug: string, userId: string) {
  const org = await db.organization.findUnique({ where: { slug: orgSlug } });
  if (!org) return { ok: false as const, error: "Organization not found." };

  const member = await db.organizationMember.findUnique({
    where: { orgId_userId: { orgId: org.id, userId } },
  });
  if (!member || member.role !== "ADMIN") {
    return { ok: false as const, error: "Only org admins can update settings." };
  }
  return { ok: true as const, org, member };
}

export async function getAllOrganizations() {
  return getAllOrganizationsCached();
}

const getAllOrganizationsCached = unstable_cache(
  async () =>
    db.organization.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        type: true,
        isVerified: true,
        memberCount: true,
      },
    }),
  ["published-organizations"],
  { revalidate: 120, tags: ["published-organizations"] }
);

export async function getOrganizationPublic(slug: string) {
  return db.organization.findUnique({
    where: { slug },
    include: {
      _count: { select: { members: true, kitInventory: true } },
    },
  });
}

export async function getOrgDashboardStats(orgSlug: string) {
  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
    include: {
      members: { select: { userId: true } },
      kitInventory: { include: { kit: { select: { title: true } } } },
      kitRequests: {
        where: { status: "PENDING" },
        select: { id: true },
      },
      invites: {
        where: { status: "PENDING", expiresAt: { gt: new Date() } },
        select: { id: true },
      },
    },
  });
  if (!org) return null;

  const memberIds = org.members.map((m) => m.userId);

  const [activeEnrollments, completionsThisMonth, publishedCourses] = await Promise.all([
    memberIds.length > 0
      ? db.enrollment.count({
          where: { userId: { in: memberIds }, completedAt: null },
        })
      : 0,
    memberIds.length > 0
      ? db.enrollment.count({
          where: {
            userId: { in: memberIds },
            completedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          },
        })
      : 0,
    db.course.count({ where: { status: "PUBLISHED" } }),
  ]);

  const kitUnits = org.kitInventory.reduce((sum, row) => sum + row.quantityOnHand, 0);

  return {
    org,
    stats: {
      memberCount: org.memberCount,
      activeEnrollments,
      completionsThisMonth,
      publishedCourses,
      kitUnitsOnHand: kitUnits,
      pendingKitRequests: org.kitRequests.length,
      pendingInvites: org.invites.length,
    },
  };
}

export async function getOrgMemberCourseActivity(orgSlug: string) {
  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
    include: { members: { select: { userId: true } } },
  });
  if (!org) return [];

  const memberIds = org.members.map((m) => m.userId);
  if (memberIds.length === 0) return [];

  const grouped = await db.enrollment.groupBy({
    by: ["courseId"],
    where: { userId: { in: memberIds } },
    _count: { userId: true },
  });

  if (grouped.length === 0) return [];

  const courseIds = grouped.map((g) => g.courseId);
  const courses = await db.course.findMany({
    where: { id: { in: courseIds }, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      instructor: { select: { fullName: true } },
    },
  });

  const countMap = Object.fromEntries(grouped.map((g) => [g.courseId, g._count.userId]));

  return courses
    .map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      instructorName: c.instructor.fullName,
      enrolledMembers: countMap[c.id] ?? 0,
    }))
    .sort((a, b) => b.enrolledMembers - a.enrolledMembers);
}

export async function getOrgAnalytics(orgSlug: string) {
  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
    include: {
      members: { select: { userId: true, role: true } },
      kitInventory: { include: { kit: { select: { title: true, slug: true } } } },
      kitRequests: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          kit: { select: { title: true } },
          requester: { select: { fullName: true } },
        },
      },
    },
  });
  if (!org) return null;

  const memberIds = org.members.map((m) => m.userId);

  const enrollmentsByMonth =
    memberIds.length > 0
      ? await db.enrollment.findMany({
          where: { userId: { in: memberIds } },
          select: { enrolledAt: true, completedAt: true },
        })
      : [];

  const roleBreakdown = {
    admin: org.members.filter((m) => m.role === "ADMIN").length,
    instructor: org.members.filter((m) => m.role === "INSTRUCTOR").length,
    member: org.members.filter((m) => m.role === "MEMBER").length,
  };

  return { org, enrollmentsByMonth, roleBreakdown };
}

export async function updateOrganizationSettings(
  actorUserId: string,
  orgSlug: string,
  input: { name?: string; logoUrl?: string | null; type?: OrgType }
): Promise<ActionResult> {
  const { user } = await requireUser();
  if (user.id !== actorUserId) return { success: false, error: "Unauthorized." };

  const access = await requireOrgAdmin(orgSlug, actorUserId);
  if (!access.ok) return { success: false, error: access.error };

  await db.organization.update({
    where: { id: access.org.id },
    data: {
      name: input.name?.trim() || access.org.name,
      logoUrl: input.logoUrl !== undefined ? input.logoUrl : access.org.logoUrl,
      type: input.type ?? access.org.type,
    },
  });

  revalidatePath(`/org/${orgSlug}/settings`);
  revalidatePath(`/org/${orgSlug}/dashboard`);
  revalidatePath("/organizations");
  revalidatePath("/admin/organizations");
  revalidateTag("published-organizations");
  return { success: true, data: undefined };
}

// ─── Platform admin ─────────────────────────────────────────────────────────

export async function getAdminOrganizations() {
  await requireAdmin();
  return db.organization.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { members: true, kitRequests: true } },
    },
  });
}

export async function adminCreateOrganization(input: {
  name: string;
  slug: string;
  type: OrgType;
  logoUrl?: string;
  isVerified?: boolean;
}): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const slug = input.slug.trim().toLowerCase().replace(/\s+/g, "-");
  if (!slug || !input.name.trim()) {
    return { success: false, error: "Name and slug are required." };
  }

  const existing = await db.organization.findUnique({ where: { slug } });
  if (existing) return { success: false, error: "Slug already in use." };

  const org = await db.organization.create({
    data: {
      name: input.name.trim(),
      slug,
      type: input.type,
      logoUrl: input.logoUrl ?? null,
      isVerified: input.isVerified ?? false,
    },
  });

  revalidatePath("/admin/organizations");
  revalidatePath("/organizations");
  revalidateTag("published-organizations");
  return { success: true, data: { id: org.id } };
}

export async function adminUpdateOrganization(
  orgId: string,
  input: {
    name?: string;
    slug?: string;
    type?: OrgType;
    logoUrl?: string | null;
    isVerified?: boolean;
  }
): Promise<ActionResult> {
  await requireAdmin();

  const org = await db.organization.findUnique({ where: { id: orgId } });
  if (!org) return { success: false, error: "Organization not found." };

  if (input.slug && input.slug !== org.slug) {
    const taken = await db.organization.findUnique({ where: { slug: input.slug } });
    if (taken) return { success: false, error: "Slug already in use." };
  }

  await db.organization.update({
    where: { id: orgId },
    data: {
      name: input.name?.trim() ?? org.name,
      slug: input.slug?.trim() ?? org.slug,
      type: input.type ?? org.type,
      logoUrl: input.logoUrl !== undefined ? input.logoUrl : org.logoUrl,
      isVerified: input.isVerified ?? org.isVerified,
    },
  });

  revalidatePath("/admin/organizations");
  revalidatePath("/organizations");
  revalidateTag("published-organizations");
  return { success: true, data: undefined };
}

// ─── Org admin credential creation ───────────────────────────────────────────

/**
 * Super-admin creates an ORG_ADMIN account for an organisation.
 * Generates a temporary password, creates the user, adds them as org ADMIN,
 * and emails them their login credentials.
 */
export async function createOrgAdminCredentials(
  orgId: string,
  input: { fullName: string; email: string }
): Promise<ActionResult<{ userId: string }>> {
  await requireAdmin();

  const org = await db.organization.findUnique({ where: { id: orgId } });
  if (!org) return { success: false, error: "Organisation not found." };

  // Check email not already in use
  const existing = await db.user.findUnique({ where: { email: input.email.toLowerCase().trim() } });
  if (existing) {
    // If user exists, just add them to the org as ADMIN if not already
    const alreadyMember = await db.organizationMember.findUnique({
      where: { orgId_userId: { orgId, userId: existing.id } },
    });
    if (!alreadyMember) {
      await db.organizationMember.create({
        data: { orgId, userId: existing.id, role: "ADMIN" },
      });
      await db.user.update({
        where: { id: existing.id },
        data: { role: "ORG_ADMIN" },
      });
    }
    revalidatePath("/admin/organizations");
    return { success: true, data: { userId: existing.id } };
  }

  // Generate a secure temporary password
  const tempPassword = randomBytes(5).toString("hex").toUpperCase() + "!1";
  const passwordHash = await hash(tempPassword, 12);

  // Generate username from email
  const baseUsername = input.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  let username = baseUsername;
  let suffix = 0;
  while (await db.user.findUnique({ where: { username } })) {
    suffix++;
    username = `${baseUsername}${suffix}`;
  }

  const user = await db.user.create({
    data: {
      email: input.email.toLowerCase().trim(),
      fullName: input.fullName.trim(),
      username,
      passwordHash,
      role: "ORG_ADMIN",
      emailVerified: true,
    },
  });

  await db.organizationMember.create({
    data: { orgId, userId: user.id, role: "ADMIN" },
  });

  // Send credentials email
  await sendEmail({
    to: user.email,
    subject: `[ujuziPlus] Your Organisation Admin Account — ${org.name}`,
    html: orgAdminCredentialsEmail({
      fullName: user.fullName ?? input.fullName,
      orgName: org.name,
      email: user.email,
      password: tempPassword,
      loginUrl: `${APP_URL}/auth/login`,
    }),
  });

  revalidatePath("/admin/organizations");
  return { success: true, data: { userId: user.id } };
}

export async function getOrgAdminUsers(orgId: string) {
  await requireAdmin();
  return db.organizationMember.findMany({
    where: { orgId, role: "ADMIN" },
    include: { user: { select: { id: true, fullName: true, email: true, createdAt: true } } },
  });
}

export async function getPublicUserProfile(username: string, viewerId?: string | null) {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      fullName: true,
      username: true,
      avatarUrl: true,
      bio: true,
      location: true,
      website: true,
      linkedin: true,
      github: true,
      role: true,
      createdAt: true,
      publicProfile: true,
      showCoursesOnProfile: true,
      showCertificatesOnProfile: true,
    },
  });
  if (!user) return null;
  if (!user.publicProfile && user.id !== viewerId) return null;

  const [courses, certCount, discussionCount] = await Promise.all([
    user.showCoursesOnProfile && user.role === "INSTRUCTOR"
      ? db.course.findMany({
          where: { instructorId: user.id, status: "PUBLISHED" },
          select: { id: true, title: true, slug: true, thumbnailUrl: true },
          orderBy: { title: "asc" },
          take: 12,
        })
      : [],
    user.showCertificatesOnProfile
      ? db.certificate.count({ where: { userId: user.id } })
      : 0,
    db.discussion.count({ where: { authorId: user.id } }),
  ]);

  return { user, courses, certCount, discussionCount };
}
