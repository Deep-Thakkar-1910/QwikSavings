import db from "@/lib/prisma";
import { UploadStoreImage } from "@/lib/utilities/CloudinaryConfig";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: { storeName: string } },
) {
  const formData = await req.formData();
  const logo = (formData.get("logo") as File) ?? null;
  const request = (await formData.get("data")) as string;
  const body = await JSON.parse(request);

  // extracting required properties
  const {
    name,
    title,
    ref_link,
    isFeatured,
    description,
    moreAbout,
    hint,
    faq,
    addToPopularStores,
    logo_url,
  } = body;

  try {
    let logoUrl;

    // If there is a logo in the form data
    if (logo) {
      // Convert the image to a buffer
      const buffer = await logo.arrayBuffer();
      // Convert buffer to bytes string for uploading to cloudinary
      const bytes = Buffer.from(buffer);
      // Pass buffer to Cloudinary to get image-url for storing in database
      logoUrl = (await UploadStoreImage(
        bytes,
        "store_images",
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

    // Update the store
    const updatedStore = await db.store.update({
      where: {
        name: context.params.storeName,
      },
      data: {
        name,
        title,
        logo_url: logoUrl || logo_url,
        ref_link,
        isFeatured: isFeatured === "yes" ? true : false,
        addToPopularStores: addToPopularStores === "yes" ? true : false,
        description: description ? description : null,
        moreAbout: moreAbout ? moreAbout : null,
        hint: hint ? hint : null,
        faq: JSON.stringify(faq),
      },
    });

    // Return response on success
    return NextResponse.json({ success: true, updatedStore }, { status: 200 });
  } catch (error) {
    // Unique constraint failed
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Store with the name ${name} already exists`,
        },
        { status: 400 },
      );
    }

    // General error response
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
