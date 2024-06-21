import {
  MAX_CAROUSEL_COUPON_LIMITS,
  MAX_FLIPPER_COUPON_LIMITS,
} from "@/lib/Constants";
import db from "@/lib/prisma";
import { UploadStoreImage } from "@/lib/utilities/CloudinaryConfig";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: { couponId: string } },
) {
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
    } = body;

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
        where: {
          addToCarousel: true,
        },
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
        where: {
          addToFlipper: true,
        },
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

    let thumbnailUrl = existingCoupon.thumbnail_url;
    if (thumbnail) {
      const buffer = await thumbnail.arrayBuffer();
      const bytes = Buffer.from(buffer);
      thumbnailUrl = (await UploadStoreImage(
        bytes,
        "coupon_images",
      )) as unknown as string;
      if (!thumbnailUrl) {
        return NextResponse.json(
          { success: false, error: "Error uploading image" },
          { status: 500 },
        );
      }
    }

    let flipperUrl = existingCoupon.flipperImage_url;
    if (flipperImage) {
      const buffer = await flipperImage.arrayBuffer();
      const bytes = Buffer.from(buffer);
      flipperUrl = (await UploadStoreImage(
        bytes,
        "coupon_images",
      )) as unknown as string;
      if (!flipperUrl) {
        return NextResponse.json(
          { success: false, error: "Error uploading image" },
          { status: 500 },
        );
      }
    }

    let carouselPosterUrl = existingCoupon.carouselPosterUrl;
    if (carouselPoster) {
      const buffer = await carouselPoster.arrayBuffer();
      const bytes = Buffer.from(buffer);
      carouselPosterUrl = (await UploadStoreImage(
        bytes,
        "coupon_images",
      )) as unknown as string;
      if (!carouselPosterUrl) {
        return NextResponse.json(
          { success: false, error: "Error uploading image" },
          { status: 500 },
        );
      }
    }

    const updatedCoupon = await db.coupon.update({
      where: {
        couponId: Number(couponId),
      },
      data: {
        store_id: Number(store_id),
        title,
        coupon_code: coupon_code ? coupon_code : null,
        type,
        category_id: Number(category_id),
        addToCarousel: addToCarousel === "yes" ? true : false,
        addToHomePage: addToHomePage === "yes" ? true : false,
        addToFlipper: addToFlipper === "yes" ? true : false,
        carouselPosterUrl,
        thumbnail_url: thumbnailUrl,
        flipperImage_url: flipperUrl,
        ref_link,
        due_date: new Date(due_date),
        description: description ? description : null,
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
