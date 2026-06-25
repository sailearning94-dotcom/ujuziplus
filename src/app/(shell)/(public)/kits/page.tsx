import { getPublishedKits, getPublishedKitCategories } from "@/lib/actions/kits";
import { KitsCatalogClient } from "@/components/kits/KitsCatalogClient";

export default async function KitsCatalogPage() {
  const [kits, categories] = await Promise.all([
    getPublishedKits(),
    getPublishedKitCategories(),
  ]);

  return (
    <KitsCatalogClient
      kits={kits}
      categories={categories}
    />
  );
}
