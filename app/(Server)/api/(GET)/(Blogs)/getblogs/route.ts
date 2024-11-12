import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export async function GET() {
  try {
    const blogs = await db.blog.findMany({
      include: {
        category: {
          select: {
            name: true,
            categoryId: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(
      { success: true, blogs, totalCount: blogs.length },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof Error) {
      const errorMessage = err.message ?? "Internal Server Error";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 },
      );
    }
  }
}
