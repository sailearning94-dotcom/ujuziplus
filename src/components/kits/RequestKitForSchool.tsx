"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RequestKitForSchool({
  kitSlug,
  orgs,
}: {
  kitSlug: string;
  orgs: { slug: string; name: string }[];
}) {
  if (orgs.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Need kits for your school?{" "}
        <Link href="/dashboard/organizations" className="text-brand underline">
          Join an organization
        </Link>{" "}
        to submit procurement requests.
      </p>
    );
  }

  const primary = orgs[0];
  return (
    <Button asChild variant="outline">
      <Link href={`/org/${primary.slug}/kits?kit=${kitSlug}`}>
        Request for {primary.name}
      </Link>
    </Button>
  );
}
