import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { deleteMultipleFilesFromS3 } from "@/lib/utilities/AwsConfig";

export async function DELETE(
  req: Request,
  context: { params: { categoryId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const deleteList: { Key: any }[] = [];
    const deletePromises = [];
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = context.params.categoryId;
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const logo_url = searchParams.get("logo_url");

    const categoryId = Number(id);

    const blogMediaToDelete = await db.blog.findMany({
      where: { category_id: categoryId },
      select: {
        thumbnail_url: true,
      },
    });

    blogMediaToDelete.forEach((blog) => {
      if (blog.thumbnail_url) {
        deleteList.push({ Key: blog.thumbnail_url });
      }
    });

    if (logo_url) {
      deleteList.push({ Key: logo_url });
    }

    deletePromises.push(
      db.category.delete({
        where: { categoryId },
      }),
    );

    deletePromises.push(deleteMultipleFilesFromS3(deleteList));

    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
