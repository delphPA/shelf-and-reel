export type Visibility = "PUBLIC" | "PRIVATE";
export type Role = "OWNER" | "MEMBER";
export type ItemType = "BOOK" | "MOVIE";
export type AgeSection = "KIDS" | "TEEN" | "ADULT";

export const AGE_SECTIONS: { value: AgeSection; label: string; emoji: string }[] = [
  { value: "KIDS", label: "Kids", emoji: "🧸" },
  { value: "TEEN", label: "Teen", emoji: "🎧" },
  { value: "ADULT", label: "Adult", emoji: "🍷" },
];

export const BOOK_GENRES = [
  "Fiction",
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "Romance",
  "Thriller",
  "Non-Fiction",
  "Biography",
  "History",
  "Poetry",
  "Classic",
  "Young Adult",
  "Picture Book",
  "Comic / Graphic Novel",
];

export const MOVIE_GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Animation",
  "Documentary",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Family",
  "Fantasy",
  "Adventure",
  "Musical",
];

export const AVATAR_EMOJIS = [
  "🙂", "😀", "😎", "🥳", "🤓", "😺", "🐶", "🦊", "🐼", "🦁",
  "🐸", "🐧", "🦄", "🐙", "🌻", "🌈", "⭐", "🍀", "🎨", "📚",
];

export function ageSectionLabel(section: string) {
  return AGE_SECTIONS.find((s) => s.value === section)?.label ?? section;
}

export function ageSectionEmoji(section: string) {
  return AGE_SECTIONS.find((s) => s.value === section)?.emoji ?? "📖";
}
