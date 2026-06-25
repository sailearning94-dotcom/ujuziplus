"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MentorCard } from "./MentorCard";
import { MENTOR_TRACKS } from "@/lib/mentors/tracks";
import { matchMentors, type SerializedMentor } from "@/lib/actions/mentors";
import { cn } from "@/lib/utils";

export function MentorMatchWizard({ mentors }: { mentors: SerializedMentor[] }) {
  const [step, setStep] = useState(0);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [matches, setMatches] = useState<SerializedMentor[]>([]);
  const [isPending, startTransition] = useTransition();

  const toggleTrack = (t: string) => {
    setSelectedTracks((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const findMatches = () => {
    startTransition(async () => {
      const results = await matchMentors(selectedTracks, goal);
      setMatches(results.length > 0 ? results : mentors.slice(0, 4));
      setStep(2);
    });
  };

  return (
    <Card className="mentor-match-wizard overflow-hidden">
      <div className="mentor-match-wizard__header">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Get matched</p>
        <h2 className="font-display text-xl font-bold text-white">
          Find a mentor for your path
        </h2>
        <p className="text-sm text-white/80">
          Three quick steps — we&apos;ll suggest practitioners who fit your goals.
        </p>
        <div className="mentor-match-wizard__steps" aria-hidden>
          {[0, 1, 2].map((s) => (
            <span
              key={s}
              className={cn("mentor-match-wizard__step-dot", step >= s && "mentor-match-wizard__step-dot--active")}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        {step === 0 && (
          <div>
            <p className="text-sm font-medium mb-3">Which tracks interest you?</p>
            <div className="flex flex-wrap gap-2">
              {MENTOR_TRACKS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={cn(
                    "mentors-filter-pill",
                    selectedTracks.includes(t) && "mentors-filter-pill--active"
                  )}
                  onClick={() => toggleTrack(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button className="mt-6" disabled={selectedTracks.length === 0} onClick={() => setStep(1)}>
              Next
            </Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              What do you want to achieve?
            </label>
            <textarea
              className="w-full rounded-lg border px-3 py-2 text-sm min-h-[90px]"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. I want to prototype an IoT weather station for my community…"
            />
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button disabled={isPending || goal.trim().length < 10} onClick={findMatches}>
                {isPending ? "Matching…" : "Find mentors"}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              {matches.length > 0
                ? "Here are mentors we think fit your goals:"
                : "Browse these mentors to get started:"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {matches.map((m) => (
                <MentorCard key={m.id} mentor={m} variant="grid" />
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>
                Start over
              </Button>
              <Button asChild variant="ghost">
                <Link href="/mentors">Browse all mentors</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
