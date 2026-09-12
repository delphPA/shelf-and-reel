"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Please paste your sign-in link or code.");
      return;
    }

    let token = trimmed;
    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length > 0) token = parts[parts.length - 1];
    } catch {
      // Not a full URL — treat the whole thing as the code.
    }

    window.location.href = `/login/${encodeURIComponent(token)}`;
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="mt-1 text-sm text-stone-600">
        Paste your personal sign-in link — or just the code at the end of it — to get back into
        your account on this device.
      </p>

      {oauthError && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {oauthError === "google_not_configured"
            ? "Google sign-in isn't set up on this site yet."
            : "Something went wrong signing in with Google. Please try again."}
        </p>
      )}

      <a
        href="/api/auth/google"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
      >
        <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="m6.3 14.7 6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 16 3 9.1 7.6 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 45c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.7 36 27 37 24 37c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9 41.4 15.9 45 24 45z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.6 36.6 45 30.9 45 24c0-1.2-.1-2.4-.4-3.5z"
          />
        </svg>
        Continue with Google
      </a>

      <div className="my-5 flex items-center gap-3 text-xs text-stone-400">
        <div className="h-px flex-1 bg-stone-200" />
        or
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste your sign-in link here"
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          autoFocus
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900"
        >
          Sign in
        </button>
      </form>
      <p className="mt-6 text-sm text-stone-500">
        Don&rsquo;t have your link handy? If you&rsquo;re signed in on another device, open your
        profile there and copy it — or ask whoever invited you to send you a fresh invite link to
        one of your bubbles instead.
      </p>
    </div>
  );
}
