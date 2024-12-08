import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { deleteMultipleFilesFromS3 } from "@/lib/utilities/AwsConfig";

export async function DELETE(
  req: Request,
  context: { params: { couponId: string } },
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

    const id = context.params.couponId;

    const couponId = Number(id);
    const coupon = await db.coupon.findUnique({
      where: { couponId },
      select: {
        thumbnail_url: true,
        flipperImage_url: true,
        carouselPosterUrl: true,
      },
    });

    if (coupon?.thumbnail_url) {
      deleteList.push({ Key: coupon.thumbnail_url });
    }

    if (coupon?.flipperImage_url) {
      deleteList.push({ Key: coupon.flipperImage_url });
    }

    if (coupon?.carouselPosterUrl) {
      deleteList.push({ Key: coupon.carouselPosterUrl });
    }

    deletePromises.push(
      db.coupon.delete({
        where: { couponId },
      }),
    );

    deletePromises.push(deleteMultipleFilesFromS3(deleteList));

    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
