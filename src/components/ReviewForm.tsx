"use client";

import { useState } from "react";
import { addReviewAction } from "@/app/actions";

export function ReviewForm({
  itemId,
  bubbleId,
  defaultRating = 5,
  defaultText = "",
}: {
  itemId: string;
  bubbleId: string;
  defaultRating?: number;
  defaultText?: string;
}) {
  const [rating, setRating] = useState(defaultRating);
  return (
    <form action={addReviewAction} className="space-y-3">
      <input type="hidden" name="itemId" value={itemId} />
      <input type="hidden" name="bubbleId" value={bubbleId} />
      <input type="hidden" name="rating" value={rating} />
      <div className="flex gap-1 text-2xl">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            className={n <= rating ? "text-amber-500" : "text-stone-300"}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        name="text"
        defaultValue={defaultText}
        rows={3}
        maxLength={1000}
        placeholder="What did you think?"
        className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
      >
        Save review
      </button>
    </form>
  );
}
