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
  "Action & Adventure",
  "Alternate History",
  "Anthology",
  "Art & Photography",
  "Autobiography",
  "Biography",
  "Business",
  "Children's",
  "Classic",
  "Comic / Graphic Novel",
  "Contemporary Fiction",
  "Cookbooks",
  "Crime",
  "Cyberpunk",
  "Dystopian",
  "Erotica",
  "Essays",
  "Fairy Tale / Fable",
  "Fantasy",
  "Health & Wellness",
  "Historical Fiction",
  "History",
  "Horror",
  "Humor",
  "LGBTQ+",
  "Literary Fiction",
  "Magical Realism",
  "Manga",
  "Memoir",
  "Middle Grade",
  "Mystery",
  "Mythology",
  "Nature",
  "Non-Fiction",
  "Paranormal",
  "Philosophy",
  "Picture Book",
  "Poetry",
  "Politics",
  "Psychology",
  "Reference",
  "Religion & Spirituality",
  "Romance",
  "Satire",
  "Sci-Fi",
  "Self-Help",
  "Short Stories",
  "Space Opera",
  "Sports",
  "Steampunk",
  "Suspense",
  "Textbook",
  "Thriller",
  "Travel",
  "True Crime",
  "Urban Fantasy",
  "War",
  "Western",
  "Young Adult",
];

export const MOVIE_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Anime",
  "Biography",
  "Christmas / Holiday",
  "Comedy",
  "Coming-of-Age",
  "Courtroom / Legal",
  "Crime",
  "Cult Classic",
  "Disaster",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film-Noir",
  "Found Footage",
  "Heist",
  "History",
  "Horror",
  "Indie",
  "Martial Arts",
  "Mockumentary",
  "Musical",
  "Mystery",
  "Political",
  "Psychological Thriller",
  "Romance",
  "Romantic Comedy",
  "Sci-Fi",
  "Short Film",
  "Slasher",
  "Spy",
  "Sport",
  "Superhero",
  "Suspense",
  "Thriller",
  "War",
  "Western",
  "Zombie",
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
