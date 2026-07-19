/**
 * Platform-wide settings (singleton row) — admin-managed site config.
 */
"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import type { ActionResult } from "./courses";
import { requireAdmin } from "@/lib/auth-server";

const SETTINGS_ID = "singleton";

const getPlatformSettingsCached = unstable_cache(
  async () =>
    db.platformSettings.upsert({
      where: { id: SETTINGS_ID },
      update: {},
      create: { id: SETTINGS_ID },
    }),
  ["platform-settings"],
  { revalidate: 300, tags: ["platform-settings"] }
);

export async function getPlatformSettings() {
  return getPlatformSettingsCached();
}

export async function updateHomeSectionBackground(
  homeSectionBackgroundUrl: string | null
): Promise<ActionResult> {
  await requireAdmin();

  await db.platformSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { homeSectionBackgroundUrl },
    create: { id: SETTINGS_ID, homeSectionBackgroundUrl },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidateTag("platform-settings");
  return { success: true, data: undefined };
}
