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

      <details className="rounded-md border border-stone-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-medium text-stone-700">
          Prefer to sign in with an email and password instead of a link? (optional)
        </summary>
        <div className="mt-3 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="signupEmail">
              Your email
            </label>
            <input
              id="signupEmail"
              name="signupEmail"
              type="email"
              placeholder="you@example.com"
              maxLength={254}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="signupPassword">
              Choose a password
            </label>
            <input
              id="signupPassword"
              name="signupPassword"
              type="password"
              minLength={8}
              placeholder="At least 8 characters"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </details>
    </div>
  );
}
