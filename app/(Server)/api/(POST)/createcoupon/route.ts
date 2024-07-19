import {
  MAX_CAROUSEL_COUPON_LIMITS,
  MAX_FLIPPER_COUPON_LIMITS,
} from "@/lib/Constants";
import db from "@/lib/prisma";
import { UploadStoreImage } from "@/lib/utilities/CloudinaryConfig";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const request = await req.formData();
    const thumbnail: File | null =
      (request.get("thumbnail_url") as File) ?? null;
    const flipperImage: File | null =
      (request.get("flipperImage_url") as File) ?? null;
    const carouselPoster: File | null =
      (request.get("carouselPosterUrl") as File) ?? null;
    const body = JSON.parse(request.get("data") as string);

    // extracting the required properties out of body
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
    } = body;
    // checking if the carousel limit is reached

    if (!category_id)
      return NextResponse.json({
        success: false,
        error: "Category Linking is Mandatory",
      });
    if (!store_id)
      return NextResponse.json({
        success: false,
        error: "Store Linking is Mandatory",
      });

    if (addToCarousel === "yes") {
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

    // checking if the flipper limit is reached
    if (addToFlipper === "yes") {
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

    let thumbnailUrl;
    if (thumbnail) {
      // if thumbnail is present in the form data
      const buffer = await thumbnail.arrayBuffer();
      // converting the image to array buffer
      const bytes = Buffer.from(buffer);
      // converting buffer to bytes string for uploading to cloudinary
      // uploading the thumbnail
      thumbnailUrl = (await UploadStoreImage(
        bytes,
        "coupon_images",
      )) as unknown as string;
    }
    if (!thumbnailUrl) {
      NextResponse.json(
        { success: false, error: "Error uploading image" },
        { status: 500 },
      );
    }
    // For Flipper Image
    let flipperUrl;
    if (flipperImage) {
      // if thumbnail is present in the form data
      const buffer = await flipperImage.arrayBuffer();
      // converting the image to array buffer
      const bytes = Buffer.from(buffer);
      // converting buffer to bytes string for uploading to cloudinary
      // uploading the flipper
      flipperUrl = (await UploadStoreImage(
        bytes,
        "coupon_images",
      )) as unknown as string;
    }
    if (!flipperUrl) {
      NextResponse.json(
        { success: false, error: "Error uploading image" },
        { status: 500 },
      );
    }
    let carouselPosterUrl;
    if (carouselPoster) {
      // if carousel Poster is present in the form data
      const buffer = await carouselPoster.arrayBuffer();
      // converting the image to array buffer
      const bytes = Buffer.from(buffer);
      // converting buffer to bytes string for uploading to cloudinary
      // uploading the carousel Poster
      carouselPosterUrl = (await UploadStoreImage(
        bytes,
        "coupon_images",
      )) as unknown as string;
    }
    if (!carouselPosterUrl) {
      NextResponse.json(
        { success: false, error: "Error uploading image" },
        { status: 500 },
      );
    }

    // creating a new coupon
    const coupon = await db.coupon.create({
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
        events: {
          connect: events.map((event: string) => ({
            eventId: Number(event),
          })),
        },
      },
    });

    // returning response on success
    return NextResponse.json({
      success: true,
      message: "Coupon created successfuly",
    });
  } catch (error) {
    console.error(error);
    // error response
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
