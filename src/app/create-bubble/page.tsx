import { getCurrentUser } from "@/lib/auth";
import { createBubbleAction } from "../actions";
import { NameGate } from "@/components/NameGate";

export default async function CreateBubblePage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold">Start a bubble</h1>
      <p className="mt-1 text-sm text-stone-600">
        A bubble is your circle of friends or family. You decide who joins by sharing an invite
        link, and whether the bubble is visible to everyone or just your people.
      </p>

      <form action={createBubbleAction} className="mt-6 space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="name">
            Bubble name
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={60}
            placeholder="e.g. The Bernard-Liesse family"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="description">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            maxLength={200}
            rows={2}
            placeholder="What kind of recommendations will show up here?"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>

        <fieldset>
          <legend className="mb-1 block text-sm font-medium text-stone-700">Visibility</legend>
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer rounded-md border border-stone-300 p-3 text-sm has-[:checked]:border-amber-800 has-[:checked]:bg-amber-50">
              <input type="radio" name="visibility" value="PRIVATE" defaultChecked className="mr-2" />
              <strong>Private</strong>
              <p className="mt-1 text-xs text-stone-500">
                Only people you invite can see it or join.
              </p>
            </label>
            <label className="flex-1 cursor-pointer rounded-md border border-stone-300 p-3 text-sm has-[:checked]:border-amber-800 has-[:checked]:bg-amber-50">
              <input type="radio" name="visibility" value="PUBLIC" className="mr-2" />
              <strong>Public</strong>
              <p className="mt-1 text-xs text-stone-500">
                Anyone can browse and read reviews; joining still needs an invite link.
              </p>
            </label>
          </div>
        </fieldset>

        {!user && <NameGate />}

        <button
          type="submit"
          className="w-full rounded-md bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900"
        >
          Create bubble
        </button>
      </form>
    </div>
  );
}
