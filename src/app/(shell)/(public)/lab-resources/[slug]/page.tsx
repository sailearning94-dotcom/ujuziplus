import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getLabResourceBySlug, getUserLabResourceIds } from "@/lib/actions/lab-resources";
import { LabResourceBookmarkButton } from "@/components/lab/LabResourceBookmarkButton";
import { getAuthSession } from "@/lib/auth-server";
import { RichTextRenderer } from "@/components/ui/RichTextRenderer";
import { PdfViewer } from "@/components/ui/PdfViewer";
import { ExternalLink } from "lucide-react";

export default async function LabResourceDetailPage({ params }: { params: { slug: string } }) {
  const session = await getAuthSession();
  const item = await getLabResourceBySlug(params.slug);
  if (!item) notFound();

  const savedIds = session?.user?.id ? await getUserLabResourceIds(session.user.id) : [];
  const pdfUrls = Array.isArray(item.pdfUrls) ? (item.pdfUrls as string[]) : [];
  const imageUrls = Array.isArray(item.imageUrls) ? (item.imageUrls as string[]) : [];
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MODERATOR";

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="bg-gradient-navy px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Button asChild variant="ghost" size="sm" className="mb-4 text-white/70 hover:bg-white/10 hover:text-white">
            <Link href="/lab-resources">← Lab resources</Link>
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70 capitalize">
              {item.type.toLowerCase()}
            </span>
            {item.category && (
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">{item.category}</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">{item.title}</h1>
          {item.description && <p className="mt-2 text-white/70 text-sm max-w-2xl">{item.description}</p>}
        </div>
      </div>

      {/* Thumbnail */}
      {item.thumbnailUrl && (
        <div className="w-full max-h-64 overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Body */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Rich content */}
            {item.content ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <RichTextRenderer html={item.content} />
              </div>
            ) : item.description ? (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <p className="text-gray-600">{item.description}</p>
              </div>
            ) : null}

            {/* Additional images */}
            {imageUrls.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-semibold text-base">Images</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {imageUrls.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={url}
                      alt={`${item.title} image ${i + 1}`}
                      className="rounded-xl w-full object-cover shadow-sm border border-gray-100"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* PDFs — inline viewer */}
            {pdfUrls.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-base">Documents & Datasheets</h2>
                {pdfUrls.map((url, i) => (
                  <PdfViewer key={i} url={url} defaultExpanded={i === 0} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3 sticky top-20">
              <h3 className="font-semibold text-sm text-gray-700">Resource details</h3>

              <div className="text-sm space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="capitalize font-medium">{item.type.toLowerCase()}</span>
                </div>
                {item.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                )}
                {pdfUrls.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Documents</span>
                    <span className="font-medium">{pdfUrls.length} PDF{pdfUrls.length > 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-2">
                {session?.user?.id && (
                  <LabResourceBookmarkButton
                    userId={session.user.id}
                    resourceId={item.id}
                    initialSaved={savedIds.includes(item.id)}
                    title={item.title}
                  />
                )}
                {item.externalUrl && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={item.externalUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      External resource
                    </a>
                  </Button>
                )}
                {item.fileUrl && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={item.fileUrl} download>Download file</a>
                  </Button>
                )}
                {isAdmin && (
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href={`/admin/lab-resources/${item.slug}/edit`}>Edit resource</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
