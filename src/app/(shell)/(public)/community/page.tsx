import { CHANNELS } from "@/lib/discussions/channels";
import { db } from "@/lib/db";
import { CommunityHubLayout } from "@/components/community/CommunityHubLayout";

export const dynamic = 'force-dynamic';

export default async function CommunityPreviewPage() {
  const [recent, channelCounts, total] = await Promise.all([
    db.discussion.findMany({
      where: { courseId: null },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 30,
      include: {
        author: { select: { fullName: true, username: true, avatarUrl: true } },
        _count: { select: { replies: true, likes: true } },
      },
    }),
    Promise.all(
      CHANNELS.map(async (ch) => ({
        slug: ch.slug,
        count: await db.discussion.count({ where: { channel: ch.slug, courseId: null } }),
      }))
    ),
    db.discussion.count({ where: { courseId: null } }),
  ]);

  const postCounts = Object.fromEntries(channelCounts.map((c) => [c.slug, c.count]));

  return (
    <div className="learner-canvas mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <CommunityHubLayout
        items={recent}
        total={total}
        postCounts={postCounts}
        guest
        feedBasePath="/dashboard/community"
      />
    </div>
  );
}
