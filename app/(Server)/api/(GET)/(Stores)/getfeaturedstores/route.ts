import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const featuredStores = await db.store.findMany({
      where: {
        isFeatured: true,
      },
      select: {
        storeId: true,
        logo_url: true,
      },
      take: 8,
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    });
    return NextResponse.json({ success: true, featuredStores });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
