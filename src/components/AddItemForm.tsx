"use client";

import { useState } from "react";
import { BOOK_GENRES, MOVIE_GENRES, AGE_SECTIONS } from "@/lib/types";

export function AddItemForm({ action }: { action: (formData: FormData) => void }) {
  const [type, setType] = useState<"BOOK" | "MOVIE">("BOOK");
  const genres = type === "BOOK" ? BOOK_GENRES : MOVIE_GENRES;

  return (
    <form action={action} className="space-y-5">
      <fieldset>
        <legend className="mb-1 text-sm font-medium text-neutral-700">What are you sharing?</legend>
        <div className="flex gap-3">
          <label className="flex-1 cursor-pointer rounded-md border border-neutral-300 p-3 text-center text-sm has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-50">
            <input
              type="radio"
              name="type"
              value="BOOK"
              checked={type === "BOOK"}
              onChange={() => setType("BOOK")}
              className="sr-only"
            />
            📖 Book
          </label>
          <label className="flex-1 cursor-pointer rounded-md border border-neutral-300 p-3 text-center text-sm has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-50">
            <input
              type="radio"
              name="type"
              value="MOVIE"
              checked={type === "MOVIE"}
              onChange={() => setType("MOVIE")}
              className="sr-only"
            />
            🎬 Movie
          </label>
        </div>
      </fieldset>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={120}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="creator">
          {type === "BOOK" ? "Author" : "Director"} (optional)
        </label>
        <input
          id="creator"
          name="creator"
          maxLength={80}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="genre">
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="ageSection">
            Section
          </label>
          <select
            id="ageSection"
            name="ageSection"
            defaultValue="ADULT"
            className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm"
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
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="coverUrl">
          Cover image URL (optional)
        </label>
        <input
          id="coverUrl"
          name="coverUrl"
          type="url"
          placeholder="https://..."
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="description">
          What&rsquo;s it about? (optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          maxLength={400}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <RatingInput />

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="text">
          Your review (optional)
        </label>
        <textarea
          id="text"
          name="text"
          rows={3}
          maxLength={1000}
          placeholder="Why should your bubble check this out?"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
      >
        Add to the shelf
      </button>
    </form>
  );
}

function RatingInput() {
  const [rating, setRating] = useState(5);
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700">Your rating</label>
      <input type="hidden" name="rating" value={rating} />
      <div className="flex gap-1 text-2xl">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            className={n <= rating ? "text-amber-500" : "text-neutral-300"}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
