/**
 * Student dashboard — real data from DB
 */

import Link from "next/link";
import { Suspense } from "react";
import { getAuthSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { isAdminRole, isInstructorRole } from "@/lib/auth/roles";
import { db } from "@/lib/db";
import { LearnerPageHero, HeroActions } from "@/components/shared/LearnerPageHero";
import { DashboardContent, DashboardStatsSkeleton } from "./DashboardContent";

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth/login");

  const role = session.user.role;
  if (isAdminRole(role)) redirect("/admin");
  if (isInstructorRole(role)) redirect("/instructor/dashboard");
  if (role === "ORG_ADMIN") {
    const membership = await db.organizationMember.findFirst({
      where: { userId: session.user.id, role: "ADMIN" },
      include: { org: { select: { slug: true } } },
    });
    if (membership) redirect(`/org/${membership.org.slug}/dashboard`);
    redirect("/dashboard/organizations");
  }

  const firstName = session.user.fullName?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      <LearnerPageHero
        banner="dashboard"
        eyebrow="Your learning hub"
        title={`Welcome back, ${firstName}`}
        subtitle="Track progress, resume courses, and connect with the community."
      >
        <HeroActions
          primary={{ href: "/courses", label: "Browse courses" }}
          links={[
            { href: "/dashboard/community", label: "Community" },
            { href: "/dashboard/lab", label: "Innovation lab" },
          ]}
        />
      </LearnerPageHero>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}
