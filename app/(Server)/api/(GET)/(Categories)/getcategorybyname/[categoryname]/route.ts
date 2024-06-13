import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { categoryname: string } },
) {
  try {
    const { categoryname } = context.params;

    const categoryDetails = await db.category.findUnique({
      where: {
        name: categoryname,
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
      { success: false, error: "Error fetching store details" },
      { status: 500 },
    );
  }
}