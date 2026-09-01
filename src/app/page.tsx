import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type BubbleSummary = {
  id: string;
  name: string;
  description: string | null;
  visibility: string;
  _count: { memberships: number; reviews: number };
};

const bubbleCardSelect = {
  id: true,
  name: true,
  description: true,
  visibility: true,
  _count: { select: { memberships: true, reviews: true } },
} as const;

export default async function HomePage() {
  const user = await getCurrentUser();

  const [publicBubbles, myMemberships] = await Promise.all([
    prisma.bubble.findMany({
      where: { visibility: "PUBLIC" },
      select: bubbleCardSelect,
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    user
      ? prisma.membership.findMany({
          where: { userId: user.id },
          select: { bubble: { select: bubbleCardSelect } },
          orderBy: { joinedAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  const myBubbles = myMemberships.map((m) => m.bubble);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
          Books and movies, recommended by people you{" "}
          <span className="text-amber-800">actually trust</span>.
        </h1>
        <p className="mx-auto max-w-xl text-stone-600">
          Create a private bubble for your friends and family, share what you loved, and rate it
          for kids, teens, or adults.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/create-bubble"
            className="rounded-md bg-amber-800 px-4 py-2 text-white hover:bg-amber-900"
          >
            Start a bubble
          </Link>
          <a
            href="#public-bubbles"
            className="rounded-md border border-stone-300 px-4 py-2 text-stone-700 hover:bg-white"
          >
            Browse public bubbles
          </a>
        </div>
      </section>

      {user && myBubbles.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-stone-900">Your bubbles</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myBubbles.map((b) => (
              <BubbleCard key={b.id} bubble={b} />
            ))}
          </div>
        </section>
      )}

      <section id="public-bubbles">
        <h2 className="mb-4 text-xl font-semibold text-stone-900">Public bubbles to discover</h2>
        {publicBubbles.length === 0 ? (
          <p className="text-sm text-stone-500">No public bubbles yet — be the first!</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publicBubbles.map((b) => (
              <BubbleCard key={b.id} bubble={b} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function BubbleCard({ bubble }: { bubble: BubbleSummary }) {
  const initial = bubble.name.trim().charAt(0).toUpperCase() || "?";
  return (
    <Link
      href={`/bubble/${bubble.id}`}
      className="group block rounded-[2rem] border border-white bg-white/90 p-5 shadow-[0_10px_22px_-12px_rgba(90,56,27,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_30px_-12px_rgba(90,56,27,0.6)]"
    >
      <div className="flex items-start gap-3">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-200 via-violet-200 to-rose-200 text-lg font-bold text-stone-700 shadow-inner">
          <span className="absolute left-2 top-1.5 h-3.5 w-3.5 rounded-full bg-white/70 blur-[2px]" />
          {initial}
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <h3 className="truncate font-semibold text-stone-900">{bubble.name}</h3>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
              bubble.visibility === "PUBLIC"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            {bubble.visibility === "PUBLIC" ? "Public" : "Private"}
          </span>
        </div>
      </div>
      {bubble.description && (
        <p className="mt-3 line-clamp-2 text-sm text-stone-600">{bubble.description}</p>
      )}
      <p className="mt-2 text-xs text-stone-400">
        {bubble._count.memberships} member{bubble._count.memberships === 1 ? "" : "s"} ·{" "}
        {bubble._count.reviews} recommendation{bubble._count.reviews === 1 ? "" : "s"}
      </p>
    </Link>
  );
}
