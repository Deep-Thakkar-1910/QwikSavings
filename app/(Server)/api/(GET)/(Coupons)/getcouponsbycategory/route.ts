import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const categoryName = searchParams.get("categoryName");
    if (!categoryName) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 },
      );
    }
    const decodedCategoryName = decodeURIComponent(categoryName);

    const category = await db.category.findUnique({
      where: { name: decodedCategoryName },
      select: {
        categoryId: true,
        coupons: {
          where: {
            due_date: {
              gt: new Date(),
            },
          },
          select: {
            store: {
              select: {
                slug: true,
                logo_url: true,
              },
            },
            ref_link: true,
            couponId: true,
            thumbnail_url: true,
            coupon_code: true,
            title: true,
            isVerified: true,
            user_count: true,
            type: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: categoryName === "Clothings" ? 8 : 4,
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        coupons: category.coupons,
        categoryId: category.categoryId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
