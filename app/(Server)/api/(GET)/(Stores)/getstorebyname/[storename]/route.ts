import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { storename: string } },
) {
  try {
    const { storename } = context.params;
    const storeDetails = await db.store.findUnique({
      where: {
        name: storename.trim(),
      },
      include: {
        coupons: {
          select: {
            couponId: true,
            due_date: true,
            description: true,
            coupon_code: true,
            ref_link: true,
            type: true,
            title: true,
            user_count: true,
            like_count: true,
            dislike_count: true,
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
        similarStores: {
          select: {
            name: true,
            storeId: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, storeDetails }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "Error fetching store details" },
      { status: 500 },
    );
  }
}
