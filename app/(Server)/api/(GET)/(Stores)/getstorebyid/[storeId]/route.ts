import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { storeId: string } },
) {
  try {
    const { storeId } = context.params;
    const storeDetails = await db.store.findUnique({
      where: {
        storeId: Number(storeId),
      },
      include: {
        similarStores: {
          select: {
            name: true,
            storeId: true,
          },
        },
        categories: {
          select: {
            name: true,
            categoryId: true,
          },
        },
        coupons: {
          select: {
            couponId: true,
            due_date: true,
            description: true,
            ref_link: true,
            type: true,
            title: true,
            user_count: true,
            store: {
              select: {
                logo_url: true,
              },
            },
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
