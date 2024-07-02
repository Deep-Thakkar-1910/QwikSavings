import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blogs = await db.blog.findMany({
      orderBy: { createdAt: "desc" },
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
