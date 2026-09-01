import { AVATAR_EMOJIS } from "@/lib/types";

// Shown inline inside a form for a visitor who doesn't have a session yet:
// collects the display name + avatar needed to create their account.
export function NameGate() {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4 space-y-3">
      <p className="text-sm text-stone-600">
        First time here? Pick a name so friends and family know who&rsquo;s recommending things.
      </p>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1" htmlFor="displayName">
          Your name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          placeholder="e.g. Delphine"
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          maxLength={40}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Pick an avatar</label>
        <div className="flex flex-wrap gap-1">
          {AVATAR_EMOJIS.map((emoji, i) => (
            <label key={emoji} className="cursor-pointer">
              <input
                type="radio"
                name="avatarEmoji"
                value={emoji}
                defaultChecked={i === 0}
                className="peer sr-only"
              />
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-lg border border-transparent peer-checked:border-amber-800 peer-checked:bg-white hover:bg-stone-100">
                {emoji}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
