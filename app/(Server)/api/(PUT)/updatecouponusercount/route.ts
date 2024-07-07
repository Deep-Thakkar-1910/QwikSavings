import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { couponId } = await req.json();
    if (!couponId) {
      return NextResponse.json(
        { success: false, error: "Coupon ID is required" },
        { status: 400 },
      );
    }

    const updatedCouponUserCount = await db.coupon.update({
      where: {
        couponId: couponId,
      },
      data: {
        user_count: {
          increment: 1,
        },
      },
    });
    return NextResponse.json({
      success: true,
      message: "User Incremented",
      updatedCouponUserCount,
    });
  } catch (error) {
    console.error("Error incrementing users:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
