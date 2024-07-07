import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";

export async function POST(
  req: Request,
  context: { params: { userSubmittedCouponId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userSubmittedCouponId } = context.params;
    const id = Number(userSubmittedCouponId);
    const verifiedCoupon = await db.userSubmittedCoupon.update({
      where: { id },
      data: { isVerified: true },
    });

    // Create a new Coupon based on the verified UserSubmittedCoupon
    await db.coupon.create({
      data: {
        title: verifiedCoupon.title,
        description: verifiedCoupon.description,
        coupon_code: verifiedCoupon.coupon_code,
        type: verifiedCoupon.type,
        store_id: verifiedCoupon.store_id,
        category_id: verifiedCoupon.category_id,
        ref_link: verifiedCoupon.ref_link,
        due_date: verifiedCoupon.due_date,
        isVerified: true,
        originalSubmissionId: verifiedCoupon.id,
      },
    });

    return NextResponse.json(
      { success: true, message: "Coupon verified successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
