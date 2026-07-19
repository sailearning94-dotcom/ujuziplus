import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LearnerPageHero } from "@/components/shared/LearnerPageHero";
import { MediaCard } from "@/components/shared/MediaCard";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { getOrganizationPublic } from "@/lib/actions/organizations";
import { GraduationCap } from "lucide-react";

export default async function OrganizationPublicPage({ params }: { params: { slug: string } }) {
  const org = await getOrganizationPublic(params.slug);
  if (!org) notFound();

  return (
    <div className="learner-canvas px-4 py-6 sm:px-6 lg:px-8">
      <LearnerPageHero
        banner="organizations"
        eyebrow={org.type.charAt(0) + org.type.slice(1).toLowerCase().replace("_", " ")}
        title={org.name}
        subtitle={`${org._count.members.toLocaleString()} member${org._count.members !== 1 ? "s" : ""} · ${org.courses.length} course${org.courses.length !== 1 ? "s" : ""} offered`}
      >
        {org.isVerified && (
          <Badge variant="outline" className="mt-2 border-0 bg-white/20 text-white shadow-none backdrop-blur-none">
            Verified partner
          </Badge>
        )}
      </LearnerPageHero>

      <div className="mx-auto mt-8 max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">Courses offered by {org.name}</h2>
          <Button asChild variant="outline" size="sm">
            <Link href={`/org/${org.slug}/dashboard`}>Organization portal</Link>
          </Button>
        </div>

        {org.courses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {org.courses.map((c) => (
              <MediaCard
                key={c.slug}
                href={`/courses/${c.slug}`}
                title={c.title}
                subtitle={c.subtitle ?? undefined}
                image={
                  c.thumbnailUrl ? (
                    <OptimizedImage src={c.thumbnailUrl} alt={c.title} fill sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-light">
                      <GraduationCap className="h-8 w-8 text-brand/40" />
                    </div>
                  )
                }
                badges={
                  <>
                    <Badge variant="outline" size="sm" className="bg-white/95 capitalize backdrop-blur-sm">
                      {c.level.toLowerCase()}
                    </Badge>
                    {c.isFree && (
                      <Badge variant="success" size="sm">
                        Free
                      </Badge>
                    )}
                  </>
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<GraduationCap className="h-8 w-8" />}
            title="No courses yet"
            description={`${org.name} hasn't published any courses on the platform yet.`}
          />
        )}
      </div>
    </div>
  );
}
