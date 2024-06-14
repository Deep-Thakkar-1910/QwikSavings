import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Function for getting all categories
export async function GET() {
  try {
    // get all categories
    const categories = await db.category.findMany({
      select: {
        categoryId: true,
        name: true,
      },
    });

    // return response
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    // error response
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
