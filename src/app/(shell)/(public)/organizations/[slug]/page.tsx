import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrganizationPublic } from "@/lib/actions/organizations";

export default async function OrganizationPublicPage({ params }: { params: { slug: string } }) {
  const org = await getOrganizationPublic(params.slug);
  if (!org) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-xl bg-brand p-8 text-white">
        <div className="flex items-center gap-4">
          {org.logoUrl ? (
            <Image
              src={org.logoUrl}
              alt={org.name}
              width={80}
              height={80}
              className="rounded-xl bg-white"
            />
          ) : (
            <div className="h-20 w-20 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
              {org.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="font-display text-3xl font-bold">{org.name}</h1>
            <p className="capitalize text-blue-100">
              {org.type.toLowerCase()} · {org.memberCount.toLocaleString()} members
            </p>
            {org.isVerified && (
              <Badge variant="outline" className="mt-2 border-0 bg-white/20 text-white shadow-none backdrop-blur-none">
                Verified partner
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Members</p>
          <p className="text-2xl font-bold">{org._count.members}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Courses offered</p>
          <p className="text-2xl font-bold">{org.courses.length}</p>
        </Card>
      </div>

      <Card className="mt-8 p-4">
        <h2 className="font-semibold">Courses offered by {org.name}</h2>
        {org.courses.length > 0 ? (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {org.courses.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/courses/${c.slug}`}
                  className="block overflow-hidden rounded-lg border border-gray-100 transition hover:border-brand/30 hover:shadow-sm"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {c.thumbnailUrl ? (
                      <Image src={c.thumbnailUrl} alt={c.title} fill className="object-cover" />
                    ) : null}
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-gray-900">{c.title}</p>
                    {c.subtitle && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">{c.subtitle}</p>
                    )}
                    <div className="mt-2 flex gap-1.5">
                      <Badge variant="muted" size="sm" className="capitalize">
                        {c.level.toLowerCase()}
                      </Badge>
                      {c.isFree && (
                        <Badge variant="accent" size="sm">
                          Free
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-400">No courses published by this organization yet.</p>
        )}
      </Card>

      <Button asChild className="mt-6">
        <Link href={`/org/${org.slug}/dashboard`}>Organization portal</Link>
      </Button>
    </div>
  );
}
