// app/api/getStoreRatings/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("storeId");

  if (!storeId) {
    return NextResponse.json(
      { success: false, error: "Store ID is required" },
      { status: 400 },
    );
  }

  try {
    const store = await db.store.findUnique({
      where: { storeId: Number(storeId) },
      select: { average_rating: true, ratings_count: true },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, error: "Store not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      average_rating: store.average_rating,
      ratings_count: store.ratings_count,
    });
  } catch (error) {
    console.error("Error fetching store ratings:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
