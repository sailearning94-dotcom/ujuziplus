import {
  getOrgKitInventory,
  getOrgKitRequests,
  getPublishedKitsForRequest,
} from "@/lib/actions/org-kits";
import { requireOrgStaff } from "@/lib/org-access";
import { OrgKitsPanel } from "@/components/org/OrgKitsPanel";

export default async function OrgKitsPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { kit?: string };
}) {
  const { session, isOrgAdmin } = await requireOrgStaff(params.slug);

  const [inventory, requests, publishedKits] = await Promise.all([
    getOrgKitInventory(params.slug),
    getOrgKitRequests(params.slug),
    getPublishedKitsForRequest(),
  ]);

  const preselectKitId =
    searchParams?.kit &&
    publishedKits.find((k) => k.slug === searchParams.kit)?.id;

  return (
    <OrgKitsPanel
      orgSlug={params.slug}
      userId={session.user.id}
      isOrgAdmin={isOrgAdmin}
      inventory={inventory}
      requests={requests}
      publishedKits={publishedKits}
      preselectKitId={preselectKitId ?? undefined}
    />
  );
}
