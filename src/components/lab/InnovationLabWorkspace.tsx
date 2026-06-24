"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { useAppStore } from "@/store/appStore";
import { updateSolutionLabProgress } from "@/lib/actions/solutions";
import { cn } from "@/lib/utils";
import { LearnerPageHero } from "@/components/shared/LearnerPageHero";

type JoinedSolution = {
  slug: string;
  title: string;
  labSteps: string[];
  codeTemplate: string;
  labProgress: number[];
};

const DEFAULT_CODE = `void setup() {
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
}

void loop() {
  analogWrite(5, 180);
  delay(1000);
}`;

export function InnovationLabWorkspace({
  userId,
  joinedSolutions,
}: {
  userId: string;
  joinedSolutions: JoinedSolution[];
}) {
  const [selectedSlug, setSelectedSlug] = useState(joinedSolutions[0]?.slug ?? "");
  const selected = joinedSolutions.find((s) => s.slug === selectedSlug) ?? joinedSolutions[0];
  const [completed, setCompleted] = useState<number[]>(selected?.labProgress ?? []);
  const [isPending, startTransition] = useTransition();
  const showToast = useAppStore((s) => s.showToast);

  const steps = selected?.labSteps ?? [];
  const progress = steps.length > 0 ? Math.round((completed.length / steps.length) * 100) : 0;
  const code = selected?.codeTemplate || DEFAULT_CODE;

  const selectSolution = (slug: string) => {
    const sol = joinedSolutions.find((s) => s.slug === slug);
    setSelectedSlug(slug);
    setCompleted(sol?.labProgress ?? []);
  };

  const markStep = (index: number) => {
    if (completed.includes(index) || !selected) return;
    const next = [...completed, index];
    setCompleted(next);
    showToast(`Step ${index + 1} complete`, "success");
    startTransition(async () => {
      await updateSolutionLabProgress(userId, selected.slug, next);
    });
  };

  if (joinedSolutions.length === 0) {
    return (
      <Card className="py-16 text-center">
        <h2 className="mb-2 font-display text-lg font-semibold">No solution workspaces yet</h2>
        <p className="mb-4 text-sm text-gray-500">
          Join a solution to unlock guided lab steps and the simulation workspace.
        </p>
        <Button asChild>
          <Link href="/solutions">Browse solutions</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <LearnerPageHero
        banner="solutions"
        title="Innovation Lab"
        subtitle={`${selected?.title ?? "Your workspace"} — guided steps and a simulation panel to practice hands-on.`}
      />

      <div className="flex flex-wrap gap-2">
        {joinedSolutions.map((s) => (
          <Button
            key={s.slug}
            size="sm"
            variant={selectedSlug === s.slug ? "primary" : "outline"}
            onClick={() => selectSolution(s.slug)}
          >
            {s.title}
          </Button>
        ))}
      </div>

      <ProgressBar value={progress} showLabel className="max-w-md" />

      <div className="grid h-[calc(100vh-16rem)] gap-4 lg:grid-cols-2">
        <Card className="overflow-y-auto p-5">
          <h2 className="section-accent-title mb-4 text-base">Lab steps</h2>
          {steps.length === 0 ? (
            <p className="text-sm text-gray-500">No lab steps defined for this solution yet.</p>
          ) : (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
              {steps.map((step, i) => (
                <li
                  key={step}
                  className={cn(completed.includes(i) && "text-green-600 line-through")}
                >
                  {step}
                </li>
              ))}
            </ol>
          )}
          <Button
            className="mt-6"
            disabled={isPending || steps.length === 0 || completed.length >= steps.length}
            onClick={() => {
              const next = steps.findIndex((_, i) => !completed.includes(i));
              if (next >= 0) markStep(next);
              else showToast("All steps complete!", "success");
            }}
          >
            {completed.length >= steps.length ? "All steps done" : "Mark step complete"}
          </Button>
        </Card>

        <Card className="flex flex-col overflow-hidden bg-gray-900 p-0 font-mono text-sm text-white">
          <div className="border-b border-gray-800 px-4 py-2 text-xs text-gray-500">Code workspace</div>
          <pre className="flex-1 overflow-auto p-4 text-xs leading-relaxed">{code}</pre>
          <div className="border-t border-gray-800 p-4">
            <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 text-center text-xs text-gray-500">
              IoT visualizer / Arduino simulation panel
              <br />
              <span className="text-gray-600">Simulation mode — outputs are not sent to hardware</span>
            </div>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => showToast("Simulation running — observe RPM and sensor values in the panel", "info")}
          >
            Run simulation
          </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
