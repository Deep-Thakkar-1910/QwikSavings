import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");
  const storeId = searchParams.get("storeId");
  try {
    const rating = await db.rating.findUnique({
      where: {
        userId_storeId: {
          userId: String(userId),
          storeId: Number(storeId),
        },
      },
    });

    return NextResponse.json(
      { success: true, rating: rating?.rating || null },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
