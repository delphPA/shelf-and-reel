import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "./actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shelf & Reel",
  description: "Books and movies, recommended by the people who know you best.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf3e8] text-stone-900">
        <header className="border-b-2 border-amber-800/20 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-stone-900">
              <span aria-hidden>📚🎬</span>
              <span>
                Shelf <span className="text-amber-800">&amp;</span> Reel
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              {user ? (
                <>
                  <Link href="/me" className="flex items-center gap-1.5 hover:underline">
                    <span aria-hidden>{user.avatarEmoji}</span>
                    <span>{user.name}</span>
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className="text-stone-500 hover:text-stone-900 hover:underline">
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/create-bubble" className="rounded-md bg-amber-800 px-3 py-1.5 text-white hover:bg-amber-900">
                  Get started
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-amber-800/20 py-6 text-center text-xs text-stone-500">
          Shelf &amp; Reel — recommendations from people you trust, not algorithms.
        </footer>
      </body>
    </html>
  );
}
