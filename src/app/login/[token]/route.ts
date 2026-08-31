import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setSession } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const user = await prisma.user.findUnique({ where: { loginToken: token } });

  if (!user) {
    return NextResponse.redirect(new URL("/?error=invalid-login-link", request.url));
  }

  await setSession(user.id);
  return NextResponse.redirect(new URL("/me", request.url));
}
