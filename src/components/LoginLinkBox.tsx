"use client";

import { useState } from "react";

export function LoginLinkBox({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const link =
    typeof window !== "undefined" ? `${window.location.origin}/login/${token}` : `/login/${token}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setShow(true);
    }
  }

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
      <p className="font-medium text-amber-900">Your personal sign-in link</p>
      <p className="mt-1 text-amber-800">
        Bookmark this or save it somewhere safe — it&rsquo;s how you log back in on another device
        or browser. Don&rsquo;t share it with anyone else.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={copy}
          className="rounded-md bg-amber-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800"
        >
          {copied ? "Copied!" : "Copy my link"}
        </button>
        <button type="button" onClick={() => setShow((s) => !s)} className="text-xs text-amber-800 underline">
          {show ? "hide" : "show link"}
        </button>
      </div>
      {show && <code className="mt-2 block break-all rounded bg-white px-2 py-1 text-xs">{link}</code>}
    </div>
  );
}
