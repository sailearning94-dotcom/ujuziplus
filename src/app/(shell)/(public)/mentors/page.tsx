import { getPublishedMentors, getPublicCohorts } from "@/lib/actions/mentors";
import { getAuthSession } from "@/lib/auth-server";
import { LearnerPageHero } from "@/components/shared/LearnerPageHero";
import { MentorsList } from "@/components/mentors/MentorsList";
import { MentorMatchWizard } from "@/components/mentors/MentorMatchWizard";
import { HomeMentorSpotlight } from "@/components/home/HomeMentorSpotlight";
import { MentorCohortCard } from "@/components/mentors/MentorCohortCard";
import { Card } from "@/components/ui/card";
import { joinCohort } from "@/lib/actions/mentors";
import { Users } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { MotionGrid, RevealItem } from "@/components/motion/RevealStagger";

export default async function MentorsPage() {
  const [mentors, cohorts, session] = await Promise.all([
    getPublishedMentors(),
    getPublicCohorts(),
    getAuthSession(),
  ]);

  const featured = mentors.find((m) => m.isFeatured) ?? mentors[0] ?? null;
  const isAuthenticated = !!session?.user;

  return (
    <div className="learner-canvas mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <LearnerPageHero
        banner="mentors"
        title="Learn from industry builders"
        subtitle="Admin-curated practitioners who guide what to learn next — robotics, IoT, coding, and careers across Africa."
        eyebrow={`${mentors.length} mentors · ${cohorts.length} open cohorts · Free guidance`}
      />

      {featured && (
        <Reveal className="mt-8" delay={0.05}>
          <HomeMentorSpotlight mentor={featured} />
        </Reveal>
      )}

      <Reveal className="mt-10" delay={0.08}>
        <MentorMatchWizard mentors={mentors} />
      </Reveal>

      {mentors.length === 0 ? (
        <Card className="mt-10 py-16 text-center text-sm text-gray-400">
          Mentors are being onboarded. Check back soon.
        </Card>
      ) : (
        <Reveal className="mt-10" delay={0.04}>
          <MentorsList mentors={mentors} />
        </Reveal>
      )}

      {/* Open cohorts section */}
      {cohorts.length > 0 && (
        <section id="cohorts" className="mt-16 scroll-mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-brand" />
                Open mentorship cohorts
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Join a structured cohort — learn alongside peers, guided by a mentor over several weeks.
              </p>
            </div>
            {isAuthenticated && (
              <Link href="/dashboard/mentors" className="text-sm text-brand hover:underline hidden sm:block">
                My cohorts →
              </Link>
            )}
          </div>

          <MotionGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cohorts.map((cohort) => (
              <RevealItem key={cohort.id}>
                <MentorCohortCard
                  cohort={cohort}
                  isAuthenticated={isAuthenticated}
                  onJoin={joinCohort}
                />
              </RevealItem>
            ))}
          </MotionGrid>
        </section>
      )}
    </div>
  );
}
