import { getOpenKnowledgeResources } from "@/lib/actions/open-knowledge";
import { OpenKnowledgeClient } from "@/components/knowledge/OpenKnowledgeClient";

export const revalidate = 60;

export default async function OpenKnowledgePage() {
  const resources = await getOpenKnowledgeResources();

  return <OpenKnowledgeClient resources={resources} />;
}
