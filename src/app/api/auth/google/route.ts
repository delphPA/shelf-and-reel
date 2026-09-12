import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { buildGoogleAuthUrl, isGoogleAuthConfigured } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  if (!isGoogleAuthConfigured()) {
    return NextResponse.redirect(new URL("/login?error=google_not_configured", request.url));
  }

  const state = randomUUID();
  const store = await cookies();
  store.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });

  const redirectUri = new URL("/api/auth/google/callback", request.url).toString();
  const authUrl = buildGoogleAuthUrl(redirectUri, state);
  return NextResponse.redirect(authUrl);
}
