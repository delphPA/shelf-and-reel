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
      <body className="min-h-full flex flex-col bg-[#faf7f2] text-neutral-900">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <span aria-hidden>📚🎬</span>
              <span>Shelf &amp; Reel</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              {user ? (
                <>
                  <Link href="/me" className="flex items-center gap-1.5 hover:underline">
                    <span aria-hidden>{user.avatarEmoji}</span>
                    <span>{user.name}</span>
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className="text-neutral-500 hover:text-neutral-900 hover:underline">
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/create-bubble" className="rounded-md bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-700">
                  Get started
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-400">
          Shelf &amp; Reel — recommendations from people you trust, not algorithms.
        </footer>
      </body>
    </html>
  );
}
