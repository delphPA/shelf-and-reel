import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NameGate } from "@/components/NameGate";
import { joinBubbleAction } from "../../actions";

export default async function JoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { code } = await params;
  const { error } = await searchParams;
  const bubble = await prisma.bubble.findUnique({
    where: { inviteCode: code },
    select: { id: true, name: true, description: true, visibility: true },
  });

  if (!bubble) notFound();

  const user = await getCurrentUser();
  const alreadyMember = user
    ? await prisma.membership.findUnique({
        where: { userId_bubbleId: { userId: user.id, bubbleId: bubble.id } },
      })
    : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="text-sm text-stone-500">You&rsquo;ve been invited to join</p>
      <h1 className="text-2xl font-bold">{bubble.name}</h1>
      {bubble.description && <p className="mt-1 text-stone-600">{bubble.description}</p>}

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {alreadyMember ? (
        <div className="mt-6 rounded-md border border-stone-200 bg-white p-4 text-sm">
          You&rsquo;re already part of this bubble.{" "}
          <a href={`/bubble/${bubble.id}`} className="font-medium underline">
            Go to the bubble
          </a>
        </div>
      ) : (
        <form action={joinBubbleAction} className="mt-6 space-y-5">
          <input type="hidden" name="inviteCode" value={code} />
          {user ? (
            <p className="text-sm text-stone-600">
              Joining as <strong>{user.name}</strong> {user.avatarEmoji}
            </p>
          ) : (
            <NameGate />
          )}
          <button
            type="submit"
            className="w-full rounded-md bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900"
          >
            Join {bubble.name}
          </button>
        </form>
      )}
    </div>
  );
}
