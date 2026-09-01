"use client";

import { useState } from "react";
import { BOOK_GENRES, MOVIE_GENRES, AGE_SECTIONS } from "@/lib/types";
import { updateItemAction } from "@/app/actions";

export function EditItemForm({
  itemId,
  type,
  title,
  creator,
  genre,
  ageSection,
  description,
  coverUrl,
}: {
  itemId: string;
  type: "BOOK" | "MOVIE";
  title: string;
  creator: string | null;
  genre: string;
  ageSection: string;
  description: string | null;
  coverUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const genres = type === "BOOK" ? BOOK_GENRES : MOVIE_GENRES;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 text-sm text-amber-800 underline"
      >
        Edit details
      </button>
    );
  }

  return (
    <form
      action={updateItemAction}
      className="mt-3 space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-4"
    >
      <input type="hidden" name="itemId" value={itemId} />
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="edit-title">
          Title
        </label>
        <input
          id="edit-title"
          name="title"
          defaultValue={title}
          required
          maxLength={120}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="edit-creator">
          {type === "BOOK" ? "Author" : "Director"}
        </label>
        <input
          id="edit-creator"
          name="creator"
          defaultValue={creator ?? ""}
          maxLength={80}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="edit-genre">
            Genre
          </label>
          <select
            id="edit-genre"
            name="genre"
            defaultValue={genre}
            className="w-full rounded-md border border-stone-300 px-2 py-2 text-sm"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="edit-age">
            Section
          </label>
          <select
            id="edit-age"
            name="ageSection"
            defaultValue={ageSection}
            className="w-full rounded-md border border-stone-300 px-2 py-2 text-sm"
          >
            {AGE_SECTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.emoji} {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="edit-cover">
          Cover image URL
        </label>
        <input
          id="edit-cover"
          name="coverUrl"
          type="url"
          defaultValue={coverUrl ?? ""}
          placeholder="https://..."
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="edit-description">
          What&rsquo;s it about?
        </label>
        <textarea
          id="edit-description"
          name="description"
          defaultValue={description ?? ""}
          rows={2}
          maxLength={400}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          onClick={() => setOpen(false)}
          className="rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-stone-300 px-4 py-2 text-sm hover:bg-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
