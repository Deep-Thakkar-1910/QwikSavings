import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const coupons = db.coupon.findMany({
      include: {
        store: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, coupons }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      const errorMessage = err.message ?? "Internal Server Error";
      return NextResponse.json(
        { succes: false, error: errorMessage },
        { status: 500 },
      );
    }
  }
}
