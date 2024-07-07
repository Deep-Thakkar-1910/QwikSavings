import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      store_id,
      title,
      coupon_code,
      type,
      category_id,
      ref_link,
      due_date,
      description,
    } = body;

    const userSubmittedCoupon = await db.userSubmittedCoupon.create({
      data: {
        userId: session.user.id,
        store_id: Number(store_id),
        title,
        coupon_code: coupon_code ? coupon_code : null,
        type,
        category_id: Number(category_id),
        ref_link,
        due_date: new Date(due_date),
        description: description ? description : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Coupon submitted successfully.",
    });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
