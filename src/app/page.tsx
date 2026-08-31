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
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Books and movies, recommended by people you actually trust.
        </h1>
        <p className="mx-auto max-w-xl text-neutral-600">
          Create a private bubble for your friends and family, share what you loved, and rate it
          for kids, teens, or adults.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/create-bubble"
            className="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700"
          >
            Start a bubble
          </Link>
          <a
            href="#public-bubbles"
            className="rounded-md border border-neutral-300 px-4 py-2 hover:bg-white"
          >
            Browse public bubbles
          </a>
        </div>
      </section>

      {user && myBubbles.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Your bubbles</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myBubbles.map((b) => (
              <BubbleCard key={b.id} bubble={b} />
            ))}
          </div>
        </section>
      )}

      <section id="public-bubbles">
        <h2 className="mb-4 text-xl font-semibold">Public bubbles to discover</h2>
        {publicBubbles.length === 0 ? (
          <p className="text-sm text-neutral-500">No public bubbles yet — be the first!</p>
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
  return (
    <Link
      href={`/bubble/${bubble.id}`}
      className="block rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{bubble.name}</h3>
        <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
          {bubble.visibility === "PUBLIC" ? "Public" : "Private"}
        </span>
      </div>
      {bubble.description && (
        <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{bubble.description}</p>
      )}
      <p className="mt-2 text-xs text-neutral-400">
        {bubble._count.memberships} member{bubble._count.memberships === 1 ? "" : "s"} ·{" "}
        {bubble._count.reviews} recommendation{bubble._count.reviews === 1 ? "" : "s"}
      </p>
    </Link>
  );
}
