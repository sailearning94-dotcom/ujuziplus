import { getAuthSession } from "@/lib/auth-server";
import { getPublishedCourses } from "@/lib/actions/enrollments";
import { getPublishedKits } from "@/lib/actions/kits";
import { getPrograms } from "@/lib/actions/programs";
import { getCompetitions } from "@/lib/actions/competitions";
import { getAllOrganizations } from "@/lib/actions/organizations";
import {
  getHomeContinueCourse,
  getHomePendingProgram,
} from "@/lib/actions/student";
import { getFeaturedMentors } from "@/lib/actions/mentors";
import { formatDateTz } from "@/lib/utils";
import { HomePageClient } from "./HomePageClient";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  const [programs, courses, kits, competitions, organizations, continueCourse, pendingProgram, mentors] =
    await Promise.all([
      getPrograms().catch(() => []),
      getPublishedCourses().catch(() => []),
      getPublishedKits().catch(() => []),
      getCompetitions().catch(() => []),
      getAllOrganizations().catch(() => []),
      userId ? getHomeContinueCourse(userId).catch(() => null) : Promise.resolve(null),
      userId ? getHomePendingProgram(userId).catch(() => null) : Promise.resolve(null),
      getFeaturedMentors(10).catch(() => []),
    ]);

  const kitItems = kits.slice(0, 12);

  return (
    <HomePageClient
      isAuthenticated={!!userId}
      stats={{
        programCount: programs.length,
        courseCount: courses.length,
        kitCount: kits.length,
        mentorCount: mentors.length,
      }}
      continueCourse={continueCourse}
      pendingProgram={pendingProgram}
      organizations={organizations.map((o) => ({
        id: o.id,
        name: o.name,
        logoUrl: o.logoUrl,
        type: o.type,
        isVerified: o.isVerified,
        memberCount: o.memberCount,
      }))}
      programs={programs.slice(0, 8).map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        type: p.type,
        thumbnailUrl: p.thumbnailUrl,
        startDate: formatDateTz(p.startDate),
        endDate: formatDateTz(p.endDate),
        format: p.format,
        enrolledCount: p.enrolledCount,
        seats: p.seats,
      }))}
      courses={courses.slice(0, 12).map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        thumbnailUrl: c.thumbnailUrl,
        instructorName: c.instructor.fullName,
        durationHours: c.durationHours,
        level: c.level,
        category: c.category,
        isFree: c.isFree,
      }))}
      kits={kitItems}
      competitions={competitions
        .filter((c) => c.status !== "COMPLETED")
        .slice(0, 8)
        .map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          thumbnailUrl: c.thumbnailUrl,
          startDate: formatDateTz(c.startDate),
          prize: c.prize,
          status: c.status,
          teamsCount: c.teamsCount,
        }))}
      mentors={mentors}
    />
  );
}
