"use client";

import { useState, type FormEvent } from "react";
import { loginWithPasswordAction } from "../actions";

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
        Use your email and password if you set one, or paste your personal sign-in link below.
      </p>

      <form action={loginWithPasswordAction} className="mt-6 space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900"
        >
          Sign in
        </button>
      </form>

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
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-md border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Sign in with link
        </button>
      </form>

      <p className="mt-6 text-sm text-stone-500">
        Don&rsquo;t have either handy? Ask whoever invited you to send a fresh invite link to one
        of your bubbles, or set up an email and password from your profile once you&rsquo;re
        signed in somewhere.
      </p>
    </div>
  );
}
