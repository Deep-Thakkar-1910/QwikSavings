import { authOptions } from "@/lib/AuthOptions";
import {
  MAX_CAROUSEL_COUPON_LIMITS,
  MAX_FLIPPER_COUPON_LIMITS,
} from "@/lib/Constants";
import db from "@/lib/prisma";
import {
  uploadToS3,
  deleteMultipleFilesFromS3,
} from "@/lib/utilities/AwsConfig";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: { couponId: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user && session?.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while fetching user details.",
      },
      { status: 500 },
    );
  }
  const { couponId } = context.params;
  try {
    const request = await req.formData();
    const thumbnail: File | null =
      (request.get("thumbnail_url") as File) ?? null;
    const flipperImage: File | null =
      (request.get("flipperImage_url") as File) ?? null;
    const carouselPoster: File | null =
      (request.get("carouselPosterUrl") as File) ?? null;
    const body = JSON.parse(request.get("data") as string);

    const {
      store_id,
      title,
      coupon_code,
      type,
      category_id,
      ref_link,
      due_date,
      description,
      addToHomePage,
      addToCarousel,
      addToFlipper,
      events,
      keyToDeleteThumbnail,
      keyToDeleteFlipper,
      keyToDeleteCarousel,
    } = body;

    if (!category_id)
      return NextResponse.json(
        { success: false, error: "Category Linking is Mandatory" },
        { status: 400 },
      );
    if (!store_id)
      return NextResponse.json(
        { success: false, error: "Store Linking is Mandatory" },
        { status: 400 },
      );

    const existingCoupon = await db.coupon.findUnique({
      where: {
        couponId: Number(couponId),
      },
    });

    if (!existingCoupon) {
      return NextResponse.json(
        { success: false, error: "Coupon not found" },
        { status: 404 },
      );
    }

    if (addToCarousel === "yes" && !existingCoupon.addToCarousel) {
      const carouselCoupons = await db.coupon.findMany({
        where: { addToCarousel: true },
      });
      if (carouselCoupons.length >= MAX_CAROUSEL_COUPON_LIMITS) {
        return NextResponse.json(
          {
            success: false,
            error: `Can't add more than ${MAX_CAROUSEL_COUPON_LIMITS} coupons to carousel`,
          },
          { status: 400 },
        );
      }
    }

    if (addToFlipper === "yes" && !existingCoupon.addToFlipper) {
      const flipperCoupons = await db.coupon.findMany({
        where: { addToFlipper: true },
      });
      if (flipperCoupons.length >= MAX_FLIPPER_COUPON_LIMITS) {
        return NextResponse.json(
          {
            success: false,
            error: `Can't add more than ${MAX_FLIPPER_COUPON_LIMITS} coupons to flipper`,
          },
          { status: 400 },
        );
      }
    }

    const uploadPromises = [];
    const deleteKeys = [];

    let thumbnailUrl = existingCoupon.thumbnail_url;
    if (thumbnail) {
      const buffer = await thumbnail.arrayBuffer();
      const bytes = Buffer.from(buffer);
      uploadPromises.push(uploadToS3(bytes, "coupon_images"));
      if (keyToDeleteThumbnail) deleteKeys.push({ Key: keyToDeleteThumbnail });
    } else if (keyToDeleteThumbnail) {
      deleteKeys.push({ Key: keyToDeleteThumbnail });
      thumbnailUrl = null;
    }

    let flipperUrl = existingCoupon.flipperImage_url;
    if (flipperImage) {
      const buffer = await flipperImage.arrayBuffer();
      const bytes = Buffer.from(buffer);
      uploadPromises.push(uploadToS3(bytes, "coupon_images"));
      if (keyToDeleteFlipper) deleteKeys.push({ Key: keyToDeleteFlipper });
    } else if (keyToDeleteFlipper) {
      deleteKeys.push({ Key: keyToDeleteFlipper });
      flipperUrl = null;
    }

    let carouselPosterUrl = existingCoupon.carouselPosterUrl;
    if (carouselPoster) {
      const buffer = await carouselPoster.arrayBuffer();
      const bytes = Buffer.from(buffer);
      uploadPromises.push(uploadToS3(bytes, "coupon_images"));
      if (keyToDeleteCarousel) deleteKeys.push({ Key: keyToDeleteCarousel });
    } else if (keyToDeleteCarousel) {
      deleteKeys.push({ Key: keyToDeleteCarousel });
      carouselPosterUrl = null;
    }

    const uploadResults = await Promise.all(uploadPromises);

    if (thumbnail) thumbnailUrl = uploadResults.shift() ?? null;
    if (flipperImage) flipperUrl = uploadResults.shift() ?? null;
    if (carouselPoster) carouselPosterUrl = uploadResults.shift() ?? null;

    if (deleteKeys.length > 0) {
      await deleteMultipleFilesFromS3(deleteKeys);
    }

    const updatedCoupon = await db.coupon.update({
      where: {
        couponId: Number(couponId),
      },
      data: {
        store_id: Number(store_id),
        title,
        coupon_code: coupon_code || null,
        type,
        category_id: Number(category_id),
        addToCarousel: addToCarousel === "yes",
        addToHomePage: addToHomePage === "yes",
        addToFlipper: addToFlipper === "yes",
        carouselPosterUrl,
        thumbnail_url: thumbnailUrl,
        flipperImage_url: flipperUrl,
        ref_link,
        due_date: new Date(due_date),
        description: description || null,
        events: {
          connect: events.map((event: string) => ({
            eventId: Number(event),
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      coupon: updatedCoupon,
      message: "Coupon updated successfully",
    });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
