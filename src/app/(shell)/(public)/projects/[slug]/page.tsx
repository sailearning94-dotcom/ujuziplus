import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, hasUserLikedProject } from "@/lib/actions/projects";
import { ProjectLikeButton } from "@/components/projects/ProjectLikeButton";
import { ImageContainer, OptimizedImage } from "@/components/shared/OptimizedImage";
import { getAuthSession } from "@/lib/auth-server";

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const session = await getAuthSession();
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const tags = (project.tags as string[] | null) ?? [];
  const liked = session?.user?.id
    ? await hasUserLikedProject(session.user.id, project.id)
    : false;

  return (
    <div className="learner-canvas pb-12">
      <div className="relative overflow-hidden bg-gray-900">
        {project.thumbnailUrl ? (
          <ImageContainer className="absolute inset-0 opacity-40">
            <OptimizedImage
              src={project.thumbnailUrl}
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </ImageContainer>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/60" />
        <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <Button asChild variant="ghost" size="sm" className="mb-4 text-white/70 hover:bg-white/10 hover:text-white">
            <Link href="/projects">← All projects</Link>
          </Button>
          <div className="flex flex-wrap gap-2">
            <Badge className="border-0 bg-brand/30 text-white">{project.category}</Badge>
            <Badge variant="outline" className="border-white/30 bg-white/10 capitalize text-white/90">
              {project.status.toLowerCase()}
            </Badge>
            {tags.map((t) => (
              <Badge key={t} variant="outline" className="border-white/20 bg-white/5 text-white/80">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            {project.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <p className="whitespace-pre-wrap text-gray-600 leading-relaxed">{project.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Image
            src={
              project.creator.avatarUrl ??
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.creator.username}`
            }
            alt=""
            width={44}
            height={44}
            className="rounded-full ring-2 ring-brand/20"
            unoptimized
          />
          <Link href={`/profile/${project.creator.username}`} className="font-semibold hover:text-brand">
            {project.creator.fullName}
          </Link>
          <span className="text-gray-400">· {project.likesCount} likes</span>
          {session?.user?.id && (
            <ProjectLikeButton
              userId={session.user.id}
              projectId={project.id}
              initialLiked={liked}
              initialCount={project.likesCount}
            />
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.githubUrl && (
            <Button asChild variant="secondary">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          )}
          {project.demoUrl && (
            <Button asChild variant="outline">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                Live demo
              </a>
            </Button>
          )}
        </div>

        <Card className="mt-8 p-6">
          <h2 className="section-accent-title text-base">Share this project</h2>
          <p className="mt-2 text-sm text-gray-500">
            Found this inspiring? Sign in to like and showcase your own work.
          </p>
          {!session?.user && (
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/auth/login">Sign in</Link>
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
