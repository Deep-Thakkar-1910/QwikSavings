import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { deleteFromS3 } from "@/lib/utilities/AwsConfig";

export async function DELETE(
  req: Request,
  context: { params: { blogId: string } },
) {
  try {
    const deletePromise = [];
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = context.params.blogId;

    const blogId = Number(id);

    const blogMedia = await db.blog.findUnique({
      where: { blogId },
      select: {
        thumbnail_url: true,
      },
    });

    deletePromise.push(
      db.blog.delete({
        where: { blogId },
      }),
    );

    if (blogMedia?.thumbnail_url) {
      deletePromise.push(deleteFromS3(blogMedia.thumbnail_url));
    }

    await Promise.all(deletePromise);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
