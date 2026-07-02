"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LearnerPageHero } from "@/components/shared/LearnerPageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WAZILAB_LAB_FILTERS } from "@/lib/wazilab-theme";
import { WaziLabGrid } from "@/components/layout/wazilab/WaziLabGrid";
import { toggleLabResourceBookmark } from "@/lib/actions/lab-resources";
import { useAppStore } from "@/store/appStore";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type ResourceItem = {
  id: string;
  slug: string;
  title: string;
  type: string;
  category: string | null;
};

export function LabResourcesClient({
  resources,
  savedIds,
  userId,
}: {
  resources: ResourceItem[];
  savedIds: string[];
  userId: string | null;
}) {
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [tab, setTab] = useState<0 | 1>(0);
  const [saved, setSaved] = useState(new Set(savedIds));
  const [isPending, startTransition] = useTransition();
  const showToast = useAppStore((s) => s.showToast);
  const router = useRouter();

  const filtered = resources.filter((r) => {
    if (tab === 1 && !saved.has(r.id)) return false;
    if (typeFilter && r.category !== typeFilter) return false;
    return true;
  });

  const toggleSave = (resourceId: string, title: string) => {
    if (!userId) {
      router.push("/auth/login?callbackUrl=/lab-resources");
      return;
    }
    startTransition(async () => {
      const res = await toggleLabResourceBookmark(userId, resourceId);
      if (res.success) {
        setSaved((prev) => {
          const next = new Set(prev);
          if (res.data.saved) next.add(resourceId);
          else next.delete(resourceId);
          return next;
        });
        showToast(res.data.saved ? `Saved ${title}` : `Removed ${title}`, "success");
      }
    });
  };

  return (
    <div className="learner-canvas px-4 py-6 sm:px-6 lg:px-8">
      <LearnerPageHero
        banner="lab-resources"
        title="Lab Resources"
        subtitle="Hardware components, guides, and reference materials for hands-on labs."
      />

      <div className="mt-6 flex gap-1 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setTab(0)}
          className={cn(
            "border-b-2 px-4 py-2.5 text-sm font-medium transition",
            tab === 0 ? "border-brand text-brand" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          All resources
        </button>
        <button
          type="button"
          onClick={() => setTab(1)}
          className={cn(
            "border-b-2 px-4 py-2.5 text-sm font-medium transition",
            tab === 1 ? "border-brand text-brand" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          My lab ({saved.size})
        </button>
      </div>

      <Reveal delay={0.06}>
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <Card className="h-fit w-full shrink-0 p-4 lg:w-52">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Filter by category
            </p>
            <div className="mt-2 space-y-1">
              <button
                type="button"
                onClick={() => setTypeFilter(null)}
                className={cn(
                  "block w-full rounded-lg px-3 py-2 text-left text-sm transition",
                  !typeFilter ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                All
              </button>
              {WAZILAB_LAB_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTypeFilter(f)}
                  className={cn(
                    "block w-full rounded-lg px-3 py-2 text-left text-sm transition",
                    typeFilter === f ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </Card>

          <div className="flex-1">
            <p className="mb-4 text-sm text-gray-500">
              Showing {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            </p>

            {filtered.length === 0 ? (
              <Card className="py-16 text-center text-sm text-gray-400">
                {tab === 1
                  ? "Nothing saved yet. Browse resources and add to My lab."
                  : "No resources found."}
              </Card>
            ) : (
              <WaziLabGrid>
                {filtered.map((item) => (
                  <Card
                    key={item.slug}
                    hover
                    className="flex flex-col p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="mt-1 text-xs capitalize text-gray-500">
                      {item.type.toLowerCase()}
                      {item.category ? ` · ${item.category}` : ""}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={saved.has(item.id) ? "primary" : "outline"}
                        disabled={isPending}
                        onClick={() => toggleSave(item.id, item.title)}
                      >
                        {saved.has(item.id) ? "Saved" : "My lab"}
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/lab-resources/${item.slug}`}>Learn more</Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </WaziLabGrid>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
