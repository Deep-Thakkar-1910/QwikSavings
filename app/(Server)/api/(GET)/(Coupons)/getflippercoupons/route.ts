import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const flipperCoupons = await db.coupon.findMany({
      where: {
        addToFlipper: true,
      },
      select: {
        couponId: true,
        flipperImage_url: true,
        title: true,
        store: {
          select: {
            name: true,
            logo_url: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return NextResponse.json(
      {
        success: true,
        flipperCoupons,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      );
  }
}
