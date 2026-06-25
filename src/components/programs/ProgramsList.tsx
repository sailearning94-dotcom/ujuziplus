"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeatMeter } from "@/components/motion/SeatMeter";
import { MotionGrid } from "@/components/motion/RevealStagger";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const FORMAT_LABEL: Record<string, string> = {
  ONLINE: "Online",
  IN_PERSON: "In-person",
  HYBRID: "Hybrid",
};

export function ProgramsList({
  programs,
  registered,
}: {
  programs: {
    id: string;
    slug: string;
    title: string;
    type: string;
    format: string;
    thumbnailUrl?: string | null;
    startDate: Date | null;
    endDate: Date | null;
    price: unknown;
    enrolledCount: number;
    seats: number;
    status?: string;
  }[];
  registered: string[];
}) {
  return (
    <MotionGrid className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((p) => {
        const isRegistered = registered.includes(p.slug);
        const priceNum = Number(p.price);
        const price = priceNum === 0 ? "Free" : formatCurrency(priceNum);
        const seatsLeft = p.seats > 0 ? Math.max(0, p.seats - p.enrolledCount) : null;
        const isFull = seatsLeft === 0;
        const isLow = seatsLeft !== null && seatsLeft > 0 && seatsLeft <= 5;
        const isClosed = p.status?.toLowerCase() === "closed" || isFull;

        return (
          <Link key={p.id} href={`/programs/${p.slug}`}>
            <Card hover className="group flex h-full flex-col overflow-hidden p-0">
              {/* Thumbnail — compact 16:7 ratio */}
              <div className="relative w-full overflow-hidden bg-gray-100" style={{ aspectRatio: "16/7" }}>
                {p.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.thumbnailUrl}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand/10">
                    <span className="text-3xl font-black text-brand/25 select-none">{p.title.charAt(0)}</span>
                  </div>
                )}
                {/* Solid-background pill badges — always readable over any image */}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                    {p.type}
                  </span>
                  {isFull && (
                    <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">Full</span>
                  )}
                  {isClosed && !isFull && (
                    <span className="rounded-full bg-gray-700/80 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">Closed</span>
                  )}
                </div>
              </div>

              {/* Card body — compact */}
              <div className="flex flex-1 flex-col px-4 py-3">
                {/* Title */}
                <h3 className="font-display text-base font-semibold leading-snug group-hover:text-brand line-clamp-2">
                  {p.title}
                </h3>

                {/* Date + format */}
                <p className="mt-1 text-xs text-gray-500">
                  {p.startDate ? new Date(p.startDate).toLocaleDateString("en-TZ") : "TBD"}
                  {p.endDate ? ` — ${new Date(p.endDate).toLocaleDateString("en-TZ")}` : ""}
                  {" · "}
                  {FORMAT_LABEL[p.format] ?? p.format}
                </p>

                {/* Price */}
                <p className="mt-1.5 text-sm font-semibold text-brand">{price}</p>

                {/* Seat meter */}
                {p.seats > 0 && (
                  <div className="mt-2">
                    <SeatMeter enrolled={p.enrolledCount} total={p.seats} />
                  </div>
                )}

                {/* Low-seats urgency nudge */}
                {isLow && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-amber-600">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    Only {seatsLeft} {seatsLeft === 1 ? "seat" : "seats"} left
                  </p>
                )}

                <div className="flex-1" />

                {/* CTA */}
                <div className="mt-3">
                  {isRegistered ? (
                    <div className="flex items-center gap-1.5 rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      You&apos;re registered · View details
                    </div>
                  ) : isFull || isClosed ? (
                    <div className="rounded-md bg-gray-100 px-3 py-1.5 text-center text-xs font-medium text-gray-400">
                      {isFull ? "No seats available" : "Registration closed"}
                    </div>
                  ) : (
                    <div className="rounded-md bg-brand px-3 py-2 text-center text-sm font-semibold text-white transition-opacity group-hover:opacity-90">
                      Register Now →
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </MotionGrid>
  );
}
