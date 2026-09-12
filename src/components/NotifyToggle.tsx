"use client";

import { useState, useTransition } from "react";
import { updateNotificationPrefAction } from "@/app/actions";

export function NotifyToggle({
  bubbleId,
  initialValue,
  hasEmail,
}: {
  bubbleId: string;
  initialValue: boolean;
  hasEmail: boolean;
}) {
  const [checked, setChecked] = useState(initialValue);
  const [, startTransition] = useTransition();

  if (!hasEmail) {
    return (
      <p className="text-xs text-stone-500">
        Add an email on your{" "}
        <a href="/me" className="underline">
          profile
        </a>{" "}
        to get notified about new recommendations here.
      </p>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.checked;
    setChecked(next);
    const formData = new FormData();
    formData.set("bubbleId", bubbleId);
    if (next) formData.set("notify", "on");
    startTransition(() => {
      updateNotificationPrefAction(formData);
    });
  }

  return (
    <label className="flex items-center gap-2 text-sm text-stone-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="h-4 w-4 rounded border-stone-300 accent-amber-800"
      />
      🔔 Notify me about new recommendations here
    </label>
  );
}
