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
        coupons: {
          select: {
            store: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            couponId: true,
            coupon_code: true,
            title: true,
            user_count: true,
            type: true,
            due_date: true,
            ref_link: true,
            description: true,
          },

          orderBy: {
            createdAt: "desc",
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
        coupons: store?.coupons,
        totalCount: store?.coupons.length,
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
