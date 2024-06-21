import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname, origin } = req.nextUrl;

  // prevent signed in users from accessing the sign in and sign up pages
  if (session && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(`${origin}/`);
  }

  // deny the access for non admin users
  if (session?.user.role !== "admin" && pathname.startsWith("/admin")) {
    return NextResponse.rewrite(new URL("/denied", req.url));
  }

  return NextResponse.next();
}
