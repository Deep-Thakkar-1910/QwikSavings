import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const body = JSON.parse(request.body);
    const { storeId, rating, userId } = body;
    // Check if user has already rated this store
    const existingRating = await db.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (existingRating) {
      return NextResponse.json(
        { success: false, message: "You have already rated this store" },
        { status: 400 },
      );
    }

    // Create new rating
    await db.rating.create({
      data: {
        rating,
        userId,
        storeId,
      },
    });

    // Update store's total ratings and ratings count
    await db.store.update({
      where: { storeId },
      data: {
        ratings_count: {
          increment: 1,
        },
        average_rating: {
          set: await db.rating
            .aggregate({
              where: { storeId },
              _avg: {
                rating: true,
              },
            })
            .then((result) => result._avg.rating || 0),
        },
      },
    });

    return NextResponse.json(
      { success: true, message: "Rating updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating rating:", error);
    return NextResponse.json(
      { success: false, message: "Error updating rating" },
      { status: 500 },
    );
  }
}
