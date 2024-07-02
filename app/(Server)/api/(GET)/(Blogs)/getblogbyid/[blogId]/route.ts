import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { blogId: string } },
) {
  const { blogId } = context.params;
  try {
    const blogDetails = await db.blog.findUnique({
      where: {
        blogId: Number(blogId),
      },
    });
    return NextResponse.json({ success: true, blogDetails }, { status: 200 });
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
