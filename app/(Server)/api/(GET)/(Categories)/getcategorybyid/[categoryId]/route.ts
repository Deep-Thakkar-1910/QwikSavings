import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { categoryId: string } },
) {
  try {
    const { categoryId } = context.params;

    const categoryDetails = await db.category.findUnique({
      where: {
        categoryId: Number(categoryId),
      },
      include: {
        similarCategories: {
          select: {
            name: true,
            categoryId: true,
          },
        },
        stores: {
          select: {
            name: true,
            storeId: true,
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

    return NextResponse.json(
      { success: true, categoryDetails },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "Error fetching store details" },
      { status: 500 },
    );
  }
}
