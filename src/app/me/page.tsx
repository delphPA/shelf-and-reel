import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateProfileAction } from "../actions";
import { LoginLinkBox } from "@/components/LoginLinkBox";
import { AVATAR_EMOJIS } from "@/lib/types";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: { bubble: { select: { id: true, name: true, visibility: true } } },
    orderBy: { joinedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-lg space-y-8 px-4 py-10">
      <h1 className="text-2xl font-bold">Your profile</h1>

      <LoginLinkBox token={user.loginToken} />

      <form
        action={updateProfileAction}
        className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <h2 className="font-semibold">Edit profile</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            defaultValue={user.name}
            maxLength={40}
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Avatar</label>
          <div className="flex flex-wrap gap-1">
            {AVATAR_EMOJIS.map((emoji) => (
              <label key={emoji} className="cursor-pointer">
                <input
                  type="radio"
                  name="avatarEmoji"
                  value={emoji}
                  defaultChecked={emoji === user.avatarEmoji}
                  className="peer sr-only"
                />
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-lg hover:bg-neutral-100 peer-checked:border-neutral-900 peer-checked:bg-neutral-50">
                  {emoji}
                </span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Save
        </button>
      </form>

      <div>
        <h2 className="mb-3 font-semibold">Your bubbles</h2>
        {memberships.length === 0 ? (
          <p className="text-sm text-neutral-500">You haven&rsquo;t joined any bubbles yet.</p>
        ) : (
          <ul className="space-y-2">
            {memberships.map((m) => (
              <li key={m.bubble.id}>
                <Link
                  href={`/bubble/${m.bubble.id}`}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 hover:shadow-sm"
                >
                  <span>{m.bubble.name}</span>
                  <span className="text-xs text-neutral-400">{m.role === "OWNER" ? "Owner" : "Member"}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href="/create-bubble" className="mt-3 inline-block text-sm text-neutral-600 underline">
          + Start another bubble
        </Link>
      </div>
    </div>
  );
}
