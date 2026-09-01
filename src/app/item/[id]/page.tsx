import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Stars } from "@/components/Stars";
import { ReviewForm } from "@/components/ReviewForm";
import { ageSectionEmoji, ageSectionLabel } from "@/lib/types";

export default async function ItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bubble?: string }>;
}) {
  const { id } = await params;
  const { bubble: bubbleId } = await searchParams;

  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) notFound();

  const user = await getCurrentUser();

  const myMemberships = user
    ? await prisma.membership.findMany({ where: { userId: user.id }, select: { bubbleId: true } })
    : [];
  const myBubbleIds = new Set(myMemberships.map((m) => m.bubbleId));

  const allReviews = await prisma.review.findMany({
    where: { itemId: item.id },
    include: {
      user: { select: { id: true, name: true, avatarEmoji: true } },
      bubble: { select: { id: true, name: true, visibility: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const visibleReviews = allReviews.filter(
    (r) => r.bubble.visibility === "PUBLIC" || myBubbleIds.has(r.bubble.id)
  );

  // Every review of this item lives in a private bubble the visitor isn't part
  // of, so treat the item itself as invisible rather than leaking its title.
  if (visibleReviews.length === 0) notFound();

  const avg = visibleReviews.reduce((sum, r) => sum + r.rating, 0) / (visibleReviews.length || 1);

  let contextBubble: { id: string; name: string } | null = null;
  let myReviewInContext = null;
  if (bubbleId && myBubbleIds.has(bubbleId)) {
    contextBubble = await prisma.bubble.findUnique({
      where: { id: bubbleId },
      select: { id: true, name: true },
    });
    myReviewInContext = user
      ? (allReviews.find((r) => r.bubbleId === bubbleId && r.userId === user.id) ?? null)
      : null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {contextBubble && (
        <Link href={`/bubble/${contextBubble.id}`} className="text-sm text-neutral-500 hover:underline">
          ← Back to {contextBubble.name}
        </Link>
      )}

      <div className="mt-3 flex gap-5">
        <div className="flex h-40 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 text-4xl">
          {item.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.coverUrl} alt="" className="h-full w-full object-cover" />
          ) : item.type === "BOOK" ? (
            "📖"
          ) : (
            "🎬"
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-400">
            {item.type === "BOOK" ? "Book" : "Movie"}
          </p>
          <h1 className="text-2xl font-bold">{item.title}</h1>
          {item.creator && <p className="text-neutral-600">{item.creator}</p>}
          <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
            <span>
              {ageSectionEmoji(item.ageSection)} {ageSectionLabel(item.ageSection)}
            </span>
            <span>·</span>
            <span>{item.genre}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Stars rating={avg} size="text-lg" />
            <span className="text-sm text-neutral-400">
              {visibleReviews.length} review{visibleReviews.length === 1 ? "" : "s"}
            </span>
          </div>
          {item.description && <p className="mt-3 text-sm text-neutral-700">{item.description}</p>}
        </div>
      </div>

      {contextBubble && user && (
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="mb-2 font-semibold">
            {myReviewInContext ? "Update your review" : "Add your review"} in {contextBubble.name}
          </h2>
          <ReviewForm
            itemId={item.id}
            bubbleId={contextBubble.id}
            defaultRating={myReviewInContext?.rating ?? 5}
            defaultText={myReviewInContext?.text ?? ""}
          />
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-3 font-semibold">Reviews</h2>
        {visibleReviews.length === 0 && (
          <p className="text-sm text-neutral-500">No reviews visible to you yet.</p>
        )}
        <ul className="space-y-4">
          {visibleReviews.map((r) => (
            <li key={r.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{r.user.avatarEmoji}</span>
                  <span className="font-medium">{r.user.name}</span>
                  <span className="text-xs text-neutral-400">in {r.bubble.name}</span>
                </div>
                <Stars rating={r.rating} />
              </div>
              {r.text && <p className="mt-2 text-sm text-neutral-700">{r.text}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
