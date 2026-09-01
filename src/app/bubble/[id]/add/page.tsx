import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { AddItemForm } from "@/components/AddItemForm";

export default async function AddItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bubble = await prisma.bubble.findUnique({ where: { id } });
  if (!bubble) notFound();

  const user = await getCurrentUser();
  const membership = user
    ? await prisma.membership.findUnique({
        where: { userId_bubbleId: { userId: user.id, bubbleId: bubble.id } },
      })
    : null;

  if (!membership) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Join {bubble.name} first</h1>
        <p className="mt-2 text-sm text-neutral-600">
          You need to be a member of this bubble to add a recommendation. Ask a member for the
          invite link.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold">Add to {bubble.name}</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Share a book or movie and tell your bubble what you thought.
      </p>
      <div className="mt-6">
        <AddItemForm bubbleId={bubble.id} />
      </div>
    </div>
  );
}
