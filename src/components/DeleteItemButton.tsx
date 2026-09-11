"use client";

import { deleteItemAction } from "@/app/actions";

export function DeleteItemButton({ itemId, bubbleId }: { itemId: string; bubbleId?: string }) {
  return (
    <form
      action={deleteItemAction}
      onSubmit={(e) => {
        if (
          !confirm(
            "Delete this recommendation for everyone, in every bubble? This can't be undone."
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="itemId" value={itemId} />
      {bubbleId && <input type="hidden" name="bubbleId" value={bubbleId} />}
      <button type="submit" className="mt-2 text-sm text-red-700 underline">
        Delete this recommendation
      </button>
    </form>
  );
}
