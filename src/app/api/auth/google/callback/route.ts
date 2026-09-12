import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { exchangeGoogleCode, fetchGoogleUserInfo } from "@/lib/google-auth";
import { prisma } from "@/lib/db";
import { setSession } from "@/lib/auth";
import { AVATAR_EMOJIS } from "@/lib/types";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const store = await cookies();
  const expectedState = store.get("google_oauth_state")?.value;
  store.delete("google_oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", request.url));
  }

  try {
    const redirectUri = new URL("/api/auth/google/callback", request.url).toString();
    const tokens = await exchangeGoogleCode(code, redirectUri);
    const profile = await fetchGoogleUserInfo(tokens.access_token);

    let user = await prisma.user.findUnique({ where: { googleId: profile.sub } });

    if (!user) {
      const avatarEmoji = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
      try {
        user = await prisma.user.create({
          data: {
            name: profile.name || "Friend",
            email: profile.email,
            googleId: profile.sub,
            avatarEmoji,
          },
        });
      } catch (err) {
        // Someone already has that email on file (e.g. set manually on another
        // account) — the email field is informational, so drop it and retry
        // rather than blocking sign-in entirely.
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
          user = await prisma.user.create({
            data: {
              name: profile.name || "Friend",
              googleId: profile.sub,
              avatarEmoji,
            },
          });
        } else {
          throw err;
        }
      }
    }

    await setSession(user.id);
    return NextResponse.redirect(new URL("/me", request.url));
  } catch (err) {
    console.error("Google sign-in failed", err);
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", request.url));
  }
}
