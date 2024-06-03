// Api handler to get categories with details

import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page: number | undefined = Number(searchParams.get("page")) ?? 1;
  const likeQuery: string | undefined = searchParams.get("like") ?? undefined;
  const limit = 20;

  try {
    const stores = await db.store.findMany({
      where: {
        name: {
          startsWith: likeQuery ? likeQuery : "",
          mode: "insensitive",
        },
      },
      select: {
        storeId: true,
        name: true,
        logo_url: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return NextResponse.json({ success: true, stores }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
