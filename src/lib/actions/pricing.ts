/**
 * Marketing pricing plans (display only — not connected to billing)
 */
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { ActionResult } from "./courses";
import { requireAdmin } from "@/lib/auth-server";

export async function getActivePricingPlans() {
  return db.pricingPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAdminPricingPlans() {
  await requireAdmin();
  return db.pricingPlan.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function adminUpsertPricingPlan(input: {
  id?: string;
  slug: string;
  name: string;
  price: number;
  period?: string;
  features: string[];
  isPopular?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}): Promise<ActionResult> {
  await requireAdmin();

  const data = {
    slug: input.slug.trim(),
    name: input.name.trim(),
    price: input.price,
    period: input.period?.trim() || null,
    features: input.features,
    isPopular: input.isPopular ?? false,
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
    ctaLabel: input.ctaLabel?.trim() || "Get started",
    ctaHref: input.ctaHref?.trim() || null,
  };

  if (input.id) {
    await db.pricingPlan.update({ where: { id: input.id }, data });
  } else {
    await db.pricingPlan.create({ data });
  }

  revalidatePath("/admin/content");
  revalidatePath("/pricing");
  return { success: true, data: undefined };
}
