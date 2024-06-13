import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const popularStores = await db.store.findMany({
      where: {
        addToPopularStores: true,
      },
      select: {
        storeId: true,
        name: true,
      },
    });
    console.log(popularStores);
    return NextResponse.json({ success: true, popularStores }, { status: 200 });
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
