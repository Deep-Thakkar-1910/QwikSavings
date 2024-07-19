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

    const category = await db.category.findUnique({
      where: { name: categoryName },
      select: {
        blogs: {
          select: {
            blogId: true,
            updatedAt: true,
            thumbnail_url: true,
            content: true,
            title: true,
          },
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
        coupons: category.blogs,
        totalCount: category.blogs.length,
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
