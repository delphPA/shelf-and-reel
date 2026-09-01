export type Visibility = "PUBLIC" | "PRIVATE";
export type Role = "OWNER" | "MEMBER";
export type ItemType = "BOOK" | "MOVIE";
export type AgeSection = "KIDS" | "TEEN" | "ADULT";

export const AGE_SECTIONS: { value: AgeSection; label: string; emoji: string; badgeClass: string }[] = [
  { value: "KIDS", label: "Kids", emoji: "🧸", badgeClass: "bg-orange-100 text-orange-800" },
  { value: "TEEN", label: "Teen", emoji: "🎧", badgeClass: "bg-violet-100 text-violet-800" },
  { value: "ADULT", label: "Adult", emoji: "🍷", badgeClass: "bg-rose-100 text-rose-900" },
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

export function ageSectionBadgeClass(section: string) {
  return AGE_SECTIONS.find((s) => s.value === section)?.badgeClass ?? "bg-stone-100 text-stone-700";
}
