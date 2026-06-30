"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { LearnerPageHero, HeroActions, TrustStrip } from "@/components/shared/LearnerPageHero";
import { KitCard } from "@/components/kits/KitCard";
import { toKitCatalogItem } from "@/components/kits/KitCatalogItem";
import { Button } from "@/components/ui/button";
import { PLATFORM } from "@/lib/constants";
import { Reveal } from "@/components/motion/Reveal";
import { PlatformPulse } from "@/components/motion/StemDisciplineTicker";
import { HomeHeroSearch } from "@/components/home/HomeHeroSearch";
import { HomeTopicExplorer } from "@/components/home/HomeTopicExplorer";
import { HomeFeaturedSpotlight } from "@/components/home/HomeFeaturedSpotlight";
import { HomeCatalogRail } from "@/components/home/HomeCatalogRail";
import { HomeProgramCard } from "@/components/home/HomeProgramCard";
import { HomeCompetitionCard } from "@/components/home/HomeCompetitionCard";
import { HomeValueBand } from "@/components/home/HomeValueBand";
import { HomeContinueCompact } from "@/components/home/HomeContinueCompact";
import type { SerializedMentor } from "@/lib/actions/mentors";

const OrgMarquee = dynamic(
  () => import("@/components/home/HomeDiscoveryMarquee").then((m) => ({ default: m.OrgMarquee })),
  { loading: () => <div className="h-24 animate-pulse rounded-2xl bg-gray-100" /> }
);
const HomeQuickCoursePeek = dynamic(
  () => import("@/components/home/HomeQuickCoursePeek").then((m) => ({ default: m.HomeQuickCoursePeek })),
  { loading: () => <div className="h-48 animate-pulse rounded-2xl bg-gray-100" /> }
);
const HomeMentorRail = dynamic(
  () => import("@/components/home/HomeMentorRail").then((m) => ({ default: m.HomeMentorRail })),
  { loading: () => <div className="h-40 animate-pulse rounded-2xl bg-gray-100" /> }
);
const HomeMentorSpotlight = dynamic(
  () => import("@/components/home/HomeMentorSpotlight").then((m) => ({ default: m.HomeMentorSpotlight })),
  { loading: () => <div className="h-56 animate-pulse rounded-3xl bg-gray-100" /> }
);

type ContinueCourse = {
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  instructorName: string;
  durationHours: number;
  firstLessonSlug: string;
  progressPct: number;
};

type ProgramItem = {
  id: string;
  slug: string;
  title: string;
  type: string;
  thumbnailUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  format: string;
  enrolledCount: number;
  seats: number;
};

type CourseItem = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  instructorName: string;
  durationHours: number;
  level: string;
  category: string | null;
  isFree: boolean;
};

type CompetitionItem = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  startDate: string | null;
  prize: string | null;
  status: string;
  teamsCount: number;
};

type KitItem = ReturnType<typeof toKitCatalogItem>;

type OrgItem = {
  id: string;
  name: string;
  logoUrl: string | null;
  type: string;
  isVerified: boolean;
  memberCount: number;
};

const contentShellSx = {
  maxWidth: 1280,
  mx: "auto",
  px: { xs: 2, sm: 3 },
} as const;

export function HomePageClient({
  continueCourse,
  pendingProgram,
  programs,
  courses,
  kits,
  competitions,
  organizations,
  mentors,
  isAuthenticated,
  stats,
}: {
  continueCourse: ContinueCourse | null;
  pendingProgram: { title: string; slug: string; startDate: string; endDate: string; format: string } | null;
  programs: ProgramItem[];
  courses: CourseItem[];
  kits: KitItem[];
  competitions: CompetitionItem[];
  organizations: OrgItem[];
  mentors: SerializedMentor[];
  isAuthenticated: boolean;
  stats: { programCount: number; courseCount: number; kitCount: number; mentorCount?: number };
}) {
  const spotlightCourse =
    courses.find((c) => c.thumbnailUrl) ?? courses[0] ?? null;
  const spotlightProgram = programs[0] ?? null;
  const spotlightKit = kits[0] ?? null;

  const spotlightMentor = mentors.find((m) => m.isFeatured) ?? mentors[0] ?? null;

  return (
    <Box className="learner-canvas home-landing" sx={{ py: { xs: 2, md: 2.5 } }}>
      <Box sx={contentShellSx}>
        <div className="home-fold">
          <LearnerPageHero
            size="default"
            banner="home"
            className="home-hero--compact"
            eyebrow={isAuthenticated ? "Your learning hub" : "STEM · Robotics · Innovation"}
            title={
              isAuthenticated
                ? "Welcome back"
                : `Learn by building with ${PLATFORM.name}`
            }
            subtitle={
              isAuthenticated
                ? "Search, resume, or browse what's new below."
                : "Courses, kits, bootcamps & competitions for African innovators."
            }
            panel={
              continueCourse ? (
                <HomeContinueCompact
                  {...continueCourse}
                  pendingProgram={pendingProgram}
                />
              ) : undefined
            }
          >
            <div className="home-hero--compact__search">
              <HomeHeroSearch />
            </div>
            <div className="home-hero--compact__meta">
              <PlatformPulse
                programCount={stats.programCount}
                courseCount={stats.courseCount}
                kitCount={stats.kitCount}
              />
            </div>
            <HeroActions
              primary={{ href: "/courses", label: "Browse courses" }}
              links={[
                { href: "/programs", label: "Programs" },
                { href: "/mentors", label: "Mentors" },
                { href: "/kits", label: "Kits" },
                { href: "/competitions", label: "Competitions" },
              ]}
            />
            {!isAuthenticated && <TrustStrip />}
          </LearnerPageHero>
        </div>

        <div className="home-discover-stack">
          {courses.length > 0 && (
            <div className="home-discover-panel">
              <HomeQuickCoursePeek courses={courses} />
            </div>
          )}
          <div className="home-discover-panel">
            <HomeTopicExplorer />
          </div>
        </div>
      </Box>

      {(spotlightCourse || spotlightProgram || spotlightKit) && (
        <Reveal className="mt-8" delay={0.06}>
          <Box sx={contentShellSx}>
            <HomeFeaturedSpotlight
              course={spotlightCourse}
              program={spotlightProgram}
              kit={spotlightKit}
            />
          </Box>
        </Reveal>
      )}

      {spotlightMentor && (
        <Reveal className="mt-8" delay={0.065}>
          <Box sx={contentShellSx}>
            <HomeMentorSpotlight mentor={spotlightMentor} />
          </Box>
        </Reveal>
      )}

      {mentors.length >= 3 && (
        <Reveal className="mt-4" delay={0.07}>
          <Box sx={contentShellSx}>
            <HomeMentorRail mentors={mentors} />
          </Box>
        </Reveal>
      )}

      <div className="home-catalog-zone">
        {kits.length > 0 && (
          <Reveal className="mt-2" delay={0.07}>
            <Box sx={contentShellSx}>
              <HomeCatalogRail
                title="Hands-on learning kits"
                description="Hardware bundles with components, guides, and classroom materials."
                seeAllHref="/kits"
                seeAllLabel="All kits"
                itemWidth={300}
                autoScroll
              >
                {kits.map((kit) => (
                  <KitCard key={kit.id} kit={kit} />
                ))}
              </HomeCatalogRail>
            </Box>
          </Reveal>
        )}

        {programs.length > 0 && (
          <Reveal className="mt-2" delay={0.08}>
            <Box sx={contentShellSx}>
              <HomeCatalogRail
                title="Bootcamps & programs"
                description="Cohort-based learning with fixed start dates and seat limits."
                seeAllHref="/programs"
                seeAllLabel="All programs"
                itemWidth={300}
                autoScroll
              >
                {programs.map((p) => (
                  <HomeProgramCard key={p.id} {...p} />
                ))}
              </HomeCatalogRail>
            </Box>
          </Reveal>
        )}

        {competitions.length > 0 && (
          <Reveal className="mt-2" delay={0.09}>
            <Box sx={contentShellSx}>
              <HomeCatalogRail
                title="Competitions & challenges"
                description="Build, compete, and showcase your skills with teams across the platform."
                seeAllHref="/competitions"
                seeAllLabel="All competitions"
                itemWidth={300}
                autoScroll
              >
                {competitions.map((c) => (
                  <HomeCompetitionCard key={c.id} {...c} />
                ))}
              </HomeCatalogRail>
            </Box>
          </Reveal>
        )}
      </div>

      <Reveal className="mt-8" delay={0.05}>
        <Box sx={contentShellSx}>
          <HomeValueBand />
        </Box>
      </Reveal>

      {organizations.length >= 3 && (
        <Reveal className="mt-8" delay={0.05}>
          <OrgMarquee orgs={organizations} />
        </Reveal>
      )}

      {!isAuthenticated && (
        <Reveal className="mt-6">
          <Box sx={contentShellSx}>
            <div className="cta-band cta-band--live">
              <Typography sx={{ fontWeight: 800, fontSize: "1.375rem", mb: 1, letterSpacing: "-0.02em" }}>
                Create a free account
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 480, mx: "auto", lineHeight: 1.6 }}>
                Enroll in courses, track progress, join discussions, and earn certificates.
              </Typography>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="cta-band__btn">
                  <Link href="/auth/register">Sign up</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/courses">View courses</Link>
                </Button>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
    </Box>
  );
}
