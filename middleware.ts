import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname, origin } = req.nextUrl;

  if (session && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(`${origin}/`);
  }
  return NextResponse.next();
}
