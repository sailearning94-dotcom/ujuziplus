import { redirect } from "next/navigation";
import { getUserSolutionJoins } from "@/lib/actions/solutions";
import { InnovationLabWorkspace } from "@/components/lab/InnovationLabWorkspace";
import { getAuthSession } from "@/lib/auth-server";

export default async function InnovationLabPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/auth/login");

  const joins = await getUserSolutionJoins(session.user.id);

  const joinedSolutions = joins.map((j) => ({
    slug: j.solution.slug,
    title: j.solution.title,
    labSteps: (j.solution.labSteps as string[] | null) ?? [],
    codeTemplate: j.solution.codeTemplate ?? "",
    labProgress: (j.labProgress as number[] | null) ?? [],
  }));

  return (
    <InnovationLabWorkspace userId={session.user.id} joinedSolutions={joinedSolutions} />
  );
}
