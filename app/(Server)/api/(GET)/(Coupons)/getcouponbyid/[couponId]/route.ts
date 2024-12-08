import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { couponId: string } },
) {
  const { couponId } = context.params;
  try {
    const coupon = await db.coupon.findUnique({
      where: {
        couponId: Number(couponId),
      },
      include: {
        events: {
          select: {
            eventId: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, coupon }, { status: 200 });
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
