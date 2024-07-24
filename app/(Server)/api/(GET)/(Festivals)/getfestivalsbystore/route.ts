import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const storeName = searchParams.get("storeName");
    if (!storeName) {
      return NextResponse.json(
        { success: false, error: "Store name is required" },
        { status: 400 },
      );
    }

    const store = await db.store.findUnique({
      where: { name: storeName },
      select: {
        name: true,
        festivals: {
          select: {
            festivalId: true,
            name: true,
            storeId: true,
            title: true,
          },
        },
      },
    });
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        festivals: store?.festivals,
        totalCount: store?.festivals.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
