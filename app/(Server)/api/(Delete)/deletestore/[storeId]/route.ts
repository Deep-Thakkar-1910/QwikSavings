import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { deleteMultipleFilesFromS3 } from "@/lib/utilities/AwsConfig";

export async function DELETE(
  req: Request,
  context: { params: { storeId: string } },
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

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const logo_url = searchParams.get("logo_url");

    const id = context.params.storeId;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Store ID is required" },
        { status: 400 },
      );
    }

    const storeId = Number(id);
    const couponMediaTodelete = await db.coupon.findMany({
      where: {
        store_id: storeId,
      },
      select: {
        thumbnail_url: true,
        carouselPosterUrl: true,
        flipperImage_url: true,
        store: {
          select: {
            logo_url: true,
          },
        },
      },
    });

    couponMediaTodelete.forEach((media) => {
      if (media.thumbnail_url) deleteList.push({ Key: media.thumbnail_url });
      if (media.carouselPosterUrl)
        deleteList.push({ Key: media.carouselPosterUrl });
      if (media.flipperImage_url)
        deleteList.push({ Key: media.flipperImage_url });
    });

    if (logo_url) deleteList.push({ Key: logo_url });

    deletePromises.push(
      db.store.delete({
        where: { storeId },
      }),
    );

    deletePromises.push(deleteMultipleFilesFromS3(deleteList));

    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
