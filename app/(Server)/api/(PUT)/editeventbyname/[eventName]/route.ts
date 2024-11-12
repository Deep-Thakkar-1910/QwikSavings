import db from "@/lib/prisma";
import { UploadStoreImage } from "@/lib/utilities/CloudinaryConfig";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

// API handler for creating a category
export async function PUT(
  req: Request,
  context: { params: { eventName: string } },
) {
  const { eventName } = context.params;
  const formData = await req.formData();
  const logo: File | null = (formData.get("logo_url") as File) ?? null;
  const cover: File | null = (formData.get("cover_url") as File) ?? null;
  const request = (await formData.get("data")) as string;
  const body = await JSON.parse(request);
  // extracting the name out of body
  const {
    name,
    description,
    title,
    logoUrl: LogoURL,
    coverUrl: CoverURL,
  } = body;
  try {
    let logoUrl;
    let coverUrl;
    // if there is a logo in the form data
    if (logo) {
      // converting the image to a buffer
      const buffer = await logo.arrayBuffer();
      // converting buffer to bytes string for uploading to cloudinary
      const bytes = Buffer.from(buffer);
      // passing buffer to Cloudinary to get image-url for storing in database
      logoUrl = (await UploadStoreImage(
        bytes,
        "event_images",
      )) as unknown as string;
      if (!logoUrl) {
        return NextResponse.json(
          {
            success: false,
            error: "Error uploading image",
          },
          { status: 500 },
        );
      }
    }

    // if there is a cover in the form data
    if (cover) {
      // converting the image to a buffer
      const buffer = await cover.arrayBuffer();
      // converting buffer to bytes string for uploading to cloudinary
      const bytes = Buffer.from(buffer);
      // passing buffer to Cloudinary to get image-url for storing in database
      coverUrl = (await UploadStoreImage(
        bytes,
        "event_images",
      )) as unknown as string;
      if (!coverUrl) {
        return NextResponse.json(
          {
            success: false,
            error: "Error uploading image",
          },
          { status: 500 },
        );
      }
    }

    // creating the event
    const event = await db.event.update({
      where: {
        name: eventName,
      },
      data: {
        name,
        description,
        title,
        logo_url: logoUrl ? logoUrl : LogoURL,
        cover_url: coverUrl ? coverUrl : CoverURL,
      },
    });

    // returning  response on success
    return NextResponse.json(
      {
        success: true,
        message: "Event updated successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    // if Unique constraint failed
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error: `Event with the name ${name} already exists`,
          },
          { status: 400 },
        );
      }
    }

    // error response
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
