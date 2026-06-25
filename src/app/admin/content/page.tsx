import { getAdminSolutions } from "@/lib/actions/solutions";
import { getAdminLabResources } from "@/lib/actions/lab-resources";
import { getAdminBlogPosts } from "@/lib/actions/blog";
import { getAdminPricingPlans } from "@/lib/actions/pricing";
import { getAdminProjects } from "@/lib/actions/projects";
import { AdminContentPanel } from "@/components/admin/AdminContentPanel";
import { decimalToNumber } from "@/lib/serialize";

export default async function AdminContentPage() {
  const [solutions, labResources, blogPosts, pricingPlans, projects] = await Promise.all([
    getAdminSolutions(),
    getAdminLabResources(),
    getAdminBlogPosts(),
    getAdminPricingPlans(),
    getAdminProjects(),
  ]);

  return (
    <AdminContentPanel
      solutions={solutions.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        status: s.status,
        level: s.level,
        author: s.author,
        organization: s.organization,
      }))}
      labResources={labResources.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        type: r.type,
      }))}
      blogPosts={blogPosts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        status: p.status,
        category: p.category,
      }))}
      pricingPlans={pricingPlans.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: decimalToNumber(p.price),
        isActive: p.isActive,
      }))}
      projects={projects.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        isPublished: p.isPublished,
        creator: p.creator,
      }))}
    />
  );
}
