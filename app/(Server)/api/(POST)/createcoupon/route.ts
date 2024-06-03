import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const body = JSON.parse(request.body);

    // extracting the required properties out of body
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

    // creating a new coupon
    const coupon = await db.coupon.create({
      data: {
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

    // returning response on success
    return NextResponse.json({
      success: true,
      coupon,
      message: "Coupon created successfuly",
    });
  } catch (error) {
    // error response
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
