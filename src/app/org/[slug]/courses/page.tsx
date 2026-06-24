import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrgMemberCourseActivity } from "@/lib/actions/organizations";
import { getPublishedCourses } from "@/lib/actions/enrollments";
import { requireOrgStaff } from "@/lib/org-access";

export default async function OrgCoursesPage({ params }: { params: { slug: string } }) {
  const { isOrgAdmin, isPlatformStaff } = await requireOrgStaff(params.slug);
  const canManage = isOrgAdmin || isPlatformStaff;

  const [memberActivity, allPublished] = await Promise.all([
    getOrgMemberCourseActivity(params.slug),
    getPublishedCourses(),
  ]);

  const activitySlugs = new Set(memberActivity.map((c) => c.slug));
  const otherCourses = allPublished.filter((c) => !activitySlugs.has(c.slug));

  return (
    <div>
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Organization Courses</h1>
          <p className="text-sm text-gray-500">
            Courses your members are enrolled in, plus the platform catalog
          </p>
        </div>
        {canManage && (
          <Button asChild>
            <Link href="/instructor/courses/new">Create course</Link>
          </Button>
        )}
      </div>

      {memberActivity.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Member enrollments</h2>
          <div className="space-y-3">
            {memberActivity.map((c) => (
              <Card key={c.id} className="flex justify-between items-center p-4">
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-sm text-gray-500">
                    by {c.instructorName} · {c.enrolledMembers} member
                    {c.enrolledMembers !== 1 ? "s" : ""} enrolled
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/courses/${c.slug}`}>View course</Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Platform catalog</h2>
        <div className="space-y-3">
          {otherCourses.slice(0, 12).map((c) => (
            <Card key={c.id} className="flex justify-between items-center p-4">
              <div>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-500">
                  by {c.instructor.fullName} · {c._count.enrollments} total enrollments
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/courses/${c.slug}`}>View</Link>
              </Button>
            </Card>
          ))}
        </div>
        {allPublished.length === 0 && (
          <Card className="p-8 text-center text-gray-500 text-sm">
            No published courses on the platform yet.
          </Card>
        )}
      </section>
    </div>
  );
}
