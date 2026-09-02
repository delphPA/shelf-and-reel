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
      <section className="rounded-[2.5rem] bg-white/75 px-6 py-10 text-center shadow-[0_20px_40px_-20px_rgba(90,56,27,0.4)] backdrop-blur-sm space-y-4">
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
          <h2 className="mb-5 text-xl font-semibold text-stone-900">Your bubbles</h2>
          <div className="flex flex-wrap justify-center gap-6 sm:justify-start">
            {myBubbles.map((b, i) => (
              <BubbleCard key={b.id} bubble={b} index={i} />
            ))}
          </div>
        </section>
      )}

      <section id="public-bubbles">
        <h2 className="mb-5 text-xl font-semibold text-stone-900">Public bubbles to discover</h2>
        {publicBubbles.length === 0 ? (
          <p className="inline-block rounded-full bg-white/80 px-4 py-2 text-sm text-stone-600 shadow-sm">
            No public bubbles yet — be the first!
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 sm:justify-start">
            {publicBubbles.map((b, i) => (
              <BubbleCard key={b.id} bubble={b} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const BUBBLE_PALETTES = [
  "from-sky-200 via-cyan-100 to-blue-300",
  "from-fuchsia-200 via-violet-100 to-purple-300",
  "from-rose-200 via-orange-100 to-amber-300",
  "from-emerald-200 via-teal-100 to-cyan-300",
  "from-amber-200 via-yellow-100 to-lime-300",
  "from-pink-200 via-rose-100 to-fuchsia-300",
];

function BubbleCard({ bubble, index }: { bubble: BubbleSummary; index: number }) {
  const palette = BUBBLE_PALETTES[index % BUBBLE_PALETTES.length];
  return (
    <div
      className="animate-[bubble-float_5s_ease-in-out_infinite]"
      style={{ animationDelay: `${(index % 5) * 0.5}s` }}
    >
      <Link
        href={`/bubble/${bubble.id}`}
        title={bubble.description ?? undefined}
        className={`group relative flex h-40 w-40 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br ${palette} p-4 text-center shadow-[0_14px_26px_-8px_rgba(90,56,27,0.5)] ring-4 ring-white/70 transition-transform duration-300 hover:-translate-y-2 hover:scale-110 hover:shadow-[0_22px_36px_-10px_rgba(90,56,27,0.6)] sm:h-44 sm:w-44`}
      >
        <span className="pointer-events-none absolute left-7 top-6 h-7 w-7 rounded-full bg-white/80 blur-md" />
        <span className="pointer-events-none absolute right-9 bottom-10 h-3 w-3 rounded-full bg-white/60 blur-sm" />
        <span className="relative line-clamp-2 px-2 text-sm font-bold text-stone-900 sm:text-base">
          {bubble.name}
        </span>
        <span className="relative mt-1 text-[11px] text-stone-700/80">
          {bubble._count.memberships} member{bubble._count.memberships === 1 ? "" : "s"}
        </span>
        <span
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold shadow-sm ${
            bubble.visibility === "PUBLIC" ? "bg-emerald-500 text-white" : "bg-white text-stone-600"
          }`}
        >
          {bubble.visibility === "PUBLIC" ? "Public" : "Private"}
        </span>
      </Link>
    </div>
  );
}
