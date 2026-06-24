import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { getProgramBySlug, getUserProgramRegistrations } from "@/lib/actions/programs";
import { ProgramRegisterButton } from "@/components/programs/ProgramRegisterButton";
import { formatCurrency } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth-server";
import {
  CalendarDays,
  MapPin,
  Users,
  Building2,
  Banknote,
} from "lucide-react";

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const program = await getProgramBySlug(params.slug);
  if (!program || program.status === "DRAFT" || program.status === "ARCHIVED") notFound();

  const session = await getAuthSession();
  const registered = session?.user?.id
    ? await getUserProgramRegistrations(session.user.id)
    : [];
  const isRegistered = registered.includes(program.slug);
  const isFull = program.enrolledCount >= program.seats;
  const isClosed = program.status !== "OPEN";
  const price = Number(program.price);
  const pct = program.seats > 0 ? Math.round((program.enrolledCount / program.seats) * 100) : 0;
  const seatsLeft = program.seats - program.enrolledCount;

  return (
    <div className="learner-canvas pb-16">
      {/* Page header — always its own section, never overlaid on the poster */}
      <div className="bg-gradient-navy px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Button asChild variant="ghost" size="sm" className="mb-4 text-white/70 hover:bg-white/10 hover:text-white">
            <Link href="/programs">← All programs</Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className="border-0 bg-white/20 text-white">{program.type}</Badge>
            <Badge
              className={`border-0 text-white ${
                program.status === "OPEN" ? "bg-green-400/80" : "bg-gray-400/80"
              }`}
            >
              {program.status.toLowerCase()}
            </Badge>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            {program.title}
          </h1>
          {program.organization && (
            <Link
              href={`/org/${program.organization.slug}`}
              className="inline-flex items-center gap-1.5 mt-2 text-white/75 hover:text-white transition-colors text-sm"
            >
              <Building2 className="h-4 w-4 shrink-0" />
              {program.organization.name}
            </Link>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left column: poster + description */}
          <div className="lg:col-span-2 space-y-6">

            {/* Full poster — displayed at natural size, never cropped */}
            {program.posterUrl && (
              <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={program.posterUrl}
                  alt={`${program.title} poster`}
                  className="w-full h-auto block"
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              </div>
            )}

            {/* Description */}
            {program.description && (
              <Card className="p-6">
                <h2 className="font-semibold text-lg mb-3">About this program</h2>
                <p className="whitespace-pre-wrap leading-relaxed text-gray-600">
                  {program.description}
                </p>
              </Card>
            )}
          </div>

          {/* Right column: registration sidebar */}
          <div className="space-y-4">
            <Card className="p-5 space-y-4 sticky top-20">

              {/* Price */}
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-brand shrink-0" />
                <span className="text-2xl font-bold text-gray-900">
                  {price === 0 ? "Free" : formatCurrency(price)}
                </span>
              </div>

              {/* Meta details */}
              <div className="space-y-2 text-sm text-gray-600 divide-y divide-gray-100">
                {(program.startDate || program.endDate) && (
                  <div className="flex items-start gap-2 pb-2">
                    <CalendarDays className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" />
                    <span>
                      {program.startDate
                        ? new Date(program.startDate).toLocaleDateString("en-TZ", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "TBD"}
                      {program.endDate
                        ? ` – ${new Date(program.endDate).toLocaleDateString("en-TZ", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}`
                        : ""}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 py-2">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{program.format.replace("_", " ")}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Users className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{program.enrolledCount} / {program.seats} seats filled</span>
                </div>
              </div>

              {/* Capacity bar */}
              <ProgressBar value={pct} showLabel />
              {seatsLeft > 0 && seatsLeft <= 10 && !isFull && (
                <p className="text-xs font-medium text-amber-600">
                  Only {seatsLeft} seat{seatsLeft !== 1 ? "s" : ""} left!
                </p>
              )}

              {/* CTA */}
              {session?.user?.id ? (
                <ProgramRegisterButton
                  userId={session.user.id}
                  programSlug={program.slug}
                  programId={program.id}
                  price={price}
                  isRegistered={isRegistered}
                  isFull={isFull || isClosed}
                />
              ) : (
                <Button asChild size="lg" className="w-full">
                  <Link href={`/auth/login?callbackUrl=/programs/${program.slug}`}>
                    Sign in to register
                  </Link>
                </Button>
              )}

              {isClosed && !isRegistered && (
                <p className="text-xs text-center text-gray-400">Registration is closed</p>
              )}
            </Card>

            {/* Org card */}
            {program.organization && (
              <Card className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                  Offered by
                </p>
                <Link
                  href={`/org/${program.organization.slug}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  {program.organization.logoUrl ? (
                    <Image
                      src={program.organization.logoUrl}
                      alt={program.organization.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-contain border border-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-brand" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{program.organization.name}</p>
                    <p className="text-xs text-gray-400">View organisation</p>
                  </div>
                </Link>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
