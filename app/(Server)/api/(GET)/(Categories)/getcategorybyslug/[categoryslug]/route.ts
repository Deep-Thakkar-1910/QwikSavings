import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(
  req: Request,
  context: { params: { categoryslug: string } },
) {
  try {
    const { categoryslug } = context.params;
    const categoryDetails = await db.category.findUnique({
      where: {
        slug: categoryslug.trim(),
      },
      include: {
        coupons: {
          select: {
            couponId: true,
            due_date: true,
            description: true,
            ref_link: true,
            coupon_code: true,
            type: true,
            title: true,
            user_count: true,
            store: {
              select: {
                logo_url: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, categoryDetails },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "Error fetching category details" },
      { status: 500 },
    );
  }
}
