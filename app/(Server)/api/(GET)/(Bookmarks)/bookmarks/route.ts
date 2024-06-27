// app/api/bookmarks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import db from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const bookmarks = await db.bookmark.findMany({
      where: { userId: session.user.id },
      select: { couponId: true },
    });
    const bookmarkedCoupons = bookmarks.map((b) => b.couponId);
    return NextResponse.json({ success: true, bookmarkedCoupons });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
