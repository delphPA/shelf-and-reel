"use client";

import { useState } from "react";

export function InviteBox({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const link = typeof window !== "undefined" ? `${window.location.origin}/join/${inviteCode}` : `/join/${inviteCode}`;

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
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-stone-300 bg-white p-3 text-sm">
      <span className="text-stone-600">Invite people to this bubble:</span>
      <button
        type="button"
        onClick={copy}
        className="rounded-md bg-amber-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-900"
      >
        {copied ? "Copied!" : "Copy invite link"}
      </button>
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="text-xs text-stone-500 underline"
      >
        {show ? "hide" : "show link"}
      </button>
      {show && (
        <code className="w-full break-all rounded bg-stone-100 px-2 py-1 text-xs">{link}</code>
      )}
    </div>
  );
}
