/**
 * Certificate server actions — Phase 2
 */
"use server";

import { db } from "@/lib/db";
import { assertActor, requireInstructor } from "@/lib/auth-server";
import type { ActionResult } from "./courses";

// ─── Issue a certificate (called after course completion) ─────────────────────

export async function issueCertificate(
  userId: string,
  courseId: string
): Promise<ActionResult<{ verifyCode: string }>> {
  await assertActor(userId);

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { enableCert: true },
  });

  if (!course?.enableCert) {
    return { success: false, error: "This course does not offer a certificate." };
  }

  const cert = await db.certificate.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId },
    update: {},
  });

  return { success: true, data: { verifyCode: cert.verifyCode } };
}

// ─── Get all certificates for a user ─────────────────────────────────────────

export async function getMyCertificates(userId: string) {
  await assertActor(userId);

  return db.certificate.findMany({
    where: { userId },
    orderBy: { issuedAt: "desc" },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          instructor: { select: { fullName: true } },
        },
      },
    },
  });
}

// ─── Verify certificate by code (public) ─────────────────────────────────────

export async function verifyCertificate(verifyCode: string) {
  return db.certificate.findUnique({
    where: { verifyCode },
    include: {
      user: { select: { fullName: true, username: true, avatarUrl: true } },
      course: {
        select: {
          title: true,
          slug: true,
          thumbnailUrl: true,
          durationHours: true,
          instructor: { select: { fullName: true } },
        },
      },
    },
  });
}

// ─── Certificate template management (instructor / admin) ────────────────────

export async function saveCertificateTemplate(
  courseId: string,
  filePath: string
): Promise<ActionResult<{ id: string }>> {
  const { user } = await requireInstructor();
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { instructorId: true },
  });
  if (!course) return { success: false, error: "Course not found." };
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    return { success: false, error: "Forbidden" };
  }

  const tpl = await db.certificateTemplate.upsert({
    where: { courseId },
    create: { courseId, filePath },
    update: { filePath },
  });
  return { success: true, data: { id: tpl.id } };
}

export async function getCertificateTemplate(courseId: string) {
  return db.certificateTemplate.findUnique({ where: { courseId } });
}

export async function deleteCertificateTemplate(courseId: string): Promise<ActionResult> {
  const { user } = await requireInstructor();
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { instructorId: true },
  });
  if (!course) return { success: false, error: "Course not found." };
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    return { success: false, error: "Forbidden" };
  }

  await db.certificateTemplate.deleteMany({ where: { courseId } });
  return { success: true, data: undefined };
}
