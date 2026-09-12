"use client";

import { useState, type FormEvent } from "react";

export default function LoginPage() {
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
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
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
