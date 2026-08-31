import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Stars } from "@/components/Stars";
import { InviteBox } from "@/components/InviteBox";
import { AGE_SECTIONS, ageSectionEmoji } from "@/lib/types";
import type { Prisma } from "@prisma/client";

export default async function BubblePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; age?: string; genre?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const bubble = await prisma.bubble.findUnique({
    where: { id },
    include: { owner: { select: { id: true, name: true, avatarEmoji: true } } },
  });
  if (!bubble) notFound();

  const user = await getCurrentUser();
  const membership = user
    ? await prisma.membership.findUnique({
        where: { userId_bubbleId: { userId: user.id, bubbleId: bubble.id } },
      })
    : null;
  const isMember = !!membership;

  if (bubble.visibility === "PRIVATE" && !isMember) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">This bubble is private</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Ask {bubble.owner.name} for an invite link to see what&rsquo;s inside.
        </p>
      </div>
    );
  }

  const itemWhere: Prisma.ItemWhereInput = {
    reviews: { some: { bubbleId: bubble.id } },
  };
  if (sp.type === "BOOK" || sp.type === "MOVIE") itemWhere.type = sp.type;
  if (sp.age) itemWhere.ageSection = sp.age;
  if (sp.genre) itemWhere.genre = sp.genre;

  const [items, genreRows] = await Promise.all([
    prisma.item.findMany({
      where: itemWhere,
      include: {
        reviews: {
          where: { bubbleId: bubble.id },
          include: { user: { select: { id: true, name: true, avatarEmoji: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.item.findMany({
      where: { reviews: { some: { bubbleId: bubble.id } } },
      select: { genre: true },
      distinct: ["genre"],
    }),
  ]);

  const genres = genreRows.map((g) => g.genre).sort();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{bubble.name}</h1>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
              {bubble.visibility === "PUBLIC" ? "Public" : "Private"}
            </span>
          </div>
          {bubble.description && <p className="mt-1 text-neutral-600">{bubble.description}</p>}
        </div>
        {isMember && (
          <Link
            href={`/bubble/${bubble.id}/add`}
            className="shrink-0 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            + Add a recommendation
          </Link>
        )}
      </div>

      {isMember && <InviteBox inviteCode={bubble.inviteCode} />}

      <form className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Type</label>
          <select name="type" defaultValue={sp.type ?? ""} className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm">
            <option value="">All</option>
            <option value="BOOK">Books</option>
            <option value="MOVIE">Movies</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Section</label>
          <select name="age" defaultValue={sp.age ?? ""} className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm">
            <option value="">All ages</option>
            {AGE_SECTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.emoji} {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Genre</label>
          <select name="genre" defaultValue={sp.genre ?? ""} className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm">
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">
          Filter
        </button>
        {(sp.type || sp.age || sp.genre) && (
          <Link href={`/bubble/${bubble.id}`} className="text-sm text-neutral-500 underline">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && (
          <p className="text-sm text-neutral-500">Nothing here yet — be the first to add one!</p>
        )}
        {items.map((item) => {
          const avg =
            item.reviews.reduce((sum, r) => sum + r.rating, 0) / (item.reviews.length || 1);
          return (
            <Link
              key={item.id}
              href={`/item/${item.id}?bubble=${bubble.id}`}
              className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded bg-neutral-100 text-2xl overflow-hidden">
                {item.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.coverUrl} alt="" className="h-full w-full object-cover" />
                ) : item.type === "BOOK" ? (
                  "📖"
                ) : (
                  "🎬"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.title}</p>
                {item.creator && <p className="truncate text-xs text-neutral-500">{item.creator}</p>}
                <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                  <span>{ageSectionEmoji(item.ageSection)}</span>
                  <span>{item.genre}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <Stars rating={avg} size="text-sm" />
                  <span className="text-xs text-neutral-400">({item.reviews.length})</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
