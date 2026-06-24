import Image from "next/image";
import Link from "next/link";
import { getAllOrganizations } from "@/lib/actions/organizations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UJUZI } from "@/lib/ujuzi-brand";

export default async function OrganizationsPage() {
  const organizations = await getAllOrganizations();

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold" style={{ color: UJUZI.text }}>
        Organizations
      </h1>
      <p className="mt-1 text-sm" style={{ color: UJUZI.textMuted }}>
        {organizations.length} partner organizations
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <article
            key={org.id}
            className="rounded-lg border bg-white p-4 shadow-sm"
            style={{ borderColor: UJUZI.border }}
          >
            <div className="flex items-start gap-4">
              {org.logoUrl ? (
                <Image src={org.logoUrl} alt={org.name} width={48} height={48} unoptimized className="rounded" />
              ) : (
                <div className="h-12 w-12 rounded bg-brand/10 flex items-center justify-center text-brand font-bold">
                  {org.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{org.name}</h3>
                <p className="text-sm capitalize" style={{ color: UJUZI.textMuted }}>
                  {org.type.toLowerCase()} · {org.memberCount} members
                </p>
                {org.isVerified && (
                  <Badge variant="success" className="mt-1">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild size="sm" variant="secondary" className="border-brand text-brand">
                <Link href={`/organizations/${org.slug}`}>Learn more</Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
      {organizations.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">No organizations listed yet.</p>
      )}
    </div>
  );
}
