import { notFound } from "next/navigation";
import { AdminProgramForm } from "@/components/admin/AdminProgramForm";
import { getProgramById, getOrgsForSelect } from "@/lib/actions/programs";

export default async function AdminEditProgramPage({
  params,
}: {
  params: { programId: string };
}) {
  const [program, orgs] = await Promise.all([
    getProgramById(params.programId),
    getOrgsForSelect(),
  ]);
  if (!program) notFound();

  const serialized = {
    ...program,
    startDate: program.startDate ?? null,
    endDate: program.endDate ?? null,
    organizationId: program.organizationId ?? null,
    posterUrl: program.posterUrl ?? null,
  };

  return (
    <AdminProgramForm
      programId={params.programId}
      initial={serialized}
      orgs={orgs}
    />
  );
}
