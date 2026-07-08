import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserSolutionJoins, getMySubmissions } from "@/lib/actions/solutions";
import { InnovationLabWorkspace } from "@/components/lab/InnovationLabWorkspace";
import { getAuthSession } from "@/lib/auth-server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const STATUS_VARIANT: Record<string, "success" | "accent" | "warning" | "error" | "outline"> = {
  DRAFT: "outline",
  PENDING_REVIEW: "accent",
  PUBLISHED: "success",
  REJECTED: "error",
};

export default async function InnovationLabPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/auth/login");

  const [joins, mySubmissions] = await Promise.all([
    getUserSolutionJoins(session.user.id),
    getMySubmissions(),
  ]);

  const joinedSolutions = joins.map((j) => ({
    slug: j.solution.slug,
    title: j.solution.title,
    labSteps: (j.solution.labSteps as string[] | null) ?? [],
    codeTemplate: j.solution.codeTemplate ?? "",
    labProgress: (j.labProgress as number[] | null) ?? [],
  }));

  return (
    <div>
      {mySubmissions.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Your submitted solutions</h2>
            <Button asChild size="sm" variant="outline">
              <Link href="/solutions/new"><Plus className="h-3.5 w-3.5 mr-1" />Share a project</Link>
            </Button>
          </div>
          <div className="space-y-2">
            {mySubmissions.map((s) => (
              <Card key={s.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{s.title}</p>
                  <p className="text-xs text-gray-500">{s._count.joins} builder{s._count.joins !== 1 ? "s" : ""} joined</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={STATUS_VARIANT[s.status] ?? "outline"}>
                    {s.status.replace("_", " ").toLowerCase()}
                  </Badge>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/solutions/${s.slug}/edit`}>
                      {["DRAFT", "REJECTED"].includes(s.status) ? "Edit" : "View"}
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <InnovationLabWorkspace userId={session.user.id} joinedSolutions={joinedSolutions} />
    </div>
  );
}
