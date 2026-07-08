import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

// Next.js 16 renamed middleware.ts to proxy.ts (Proxy now defaults to the
// Node.js runtime, so Prisma would actually work here too) — but this uses
// the lightweight edge-safe config anyway: it only needs to verify the JWT
// cookie, not touch the database, and this file runs on every matched
// request, so skipping Prisma/bcrypt here keeps that check cheap.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/coach/:path*",
    "/debate/:path*",
    "/model-un/:path*",
    "/public-speaking/:path*",
  ],
};
