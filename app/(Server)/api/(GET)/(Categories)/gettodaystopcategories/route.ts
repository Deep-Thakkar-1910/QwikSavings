import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const topCategories = await db.category.findMany({
      where: {
        addToTodaysTopCategories: true,
      },
      select: {
        name: true,
      },
    });
    return NextResponse.json({ success: true, topCategories }, { status: 200 });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 500 },
      );
    }
  }
}
