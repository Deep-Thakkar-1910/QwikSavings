import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const carouselCoupons = await db.coupon.findMany({
      where: {
        addToCarousel: true,
      },
      select: {
        carouselPosterUrl: true,
        couponId: true,
        coupon_code: true,
        title: true,
        isVerified: true,
        user_count: true,
        type: true,
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
        carouselCoupons,
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
