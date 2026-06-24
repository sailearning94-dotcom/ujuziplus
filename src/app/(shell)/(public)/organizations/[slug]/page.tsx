import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrganizationPublic, getOrgMemberCourseActivity } from "@/lib/actions/organizations";

export default async function OrganizationPublicPage({ params }: { params: { slug: string } }) {
  const org = await getOrganizationPublic(params.slug);
  if (!org) notFound();

  const courseActivity = await getOrgMemberCourseActivity(params.slug);

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
              unoptimized
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
            {org.isVerified && <Badge className="mt-2 bg-white/20">Verified partner</Badge>}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Members</p>
          <p className="text-2xl font-bold">{org._count.members}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Kit inventory lines</p>
          <p className="text-2xl font-bold">{org._count.kitInventory}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Active course enrollments</p>
          <p className="text-2xl font-bold">{courseActivity.length}</p>
        </Card>
      </div>

      {courseActivity.length > 0 && (
        <Card className="mt-8 p-4">
          <h2 className="font-semibold">Courses members are taking</h2>
          <ul className="mt-4 space-y-2">
            {courseActivity.map((c) => (
              <li key={c.id} className="flex justify-between text-sm">
                <Link href={`/courses/${c.slug}`} className="text-brand hover:underline">
                  {c.title}
                </Link>
                <span className="text-gray-500">{c.enrolledMembers} enrolled</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Button asChild className="mt-6">
        <Link href={`/org/${org.slug}/dashboard`}>Organization portal</Link>
      </Button>
    </div>
  );
}
