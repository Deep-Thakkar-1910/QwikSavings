import { authOptions } from "@/lib/AuthOptions";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user && session?.user.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { couponId } = await req.json();

    if (!couponId) {
      return NextResponse.json(
        { success: false, error: "Coupon ID is required" },
        { status: 400 },
      );
    }

    const existingBookmark = await db.bookmark.findUnique({
      where: {
        userId_couponId: {
          userId: session.user.id,
          couponId: couponId,
        },
      },
    });

    if (existingBookmark) {
      await db.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      return NextResponse.json({ success: true, message: "Bookmark removed" });
    } else {
      await db.bookmark.create({
        data: {
          userId: session.user.id,
          couponId: couponId,
        },
      });
      return NextResponse.json({ success: true, message: "Bookmark added" });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
