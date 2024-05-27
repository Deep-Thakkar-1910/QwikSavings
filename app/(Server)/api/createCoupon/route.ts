import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

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
    const coupon = await prisma.coupon.create({
      data: {
        store_id,
        title,
        coupon_code,
        type,
        category_id,
        ref_link,
        due_date: new Date(due_date),
        description,
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
