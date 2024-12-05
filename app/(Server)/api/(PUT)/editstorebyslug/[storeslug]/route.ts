import db from "@/lib/prisma";
import { deleteFromS3, uploadToS3 } from "@/lib/utilities/AwsConfig";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: { storeslug: string } },
) {
  const formData = await req.formData();
  const logo = (formData.get("logo") as File) ?? null;
  const request = (await formData.get("data")) as string;
  const body = await JSON.parse(request);

  // extracting required properties
  const {
    name,
    title,
    slug,
    ref_link,
    isFeatured,
    description,
    moreAbout,
    hint,
    hintHeading,
    faq,
    best_offer,
    average_discount,
    addToPopularStores,
    similarStores,
    keyToDelete,
  } = body;
  let { logo_url } = body;

  try {
    if (!(logo && logo_url) && keyToDelete) {
      await deleteFromS3(keyToDelete);
      logo_url = null;
    }
    let logoUrl;

    // If there is a logo in the form data
    if (logo) {
      // Convert the image to a buffer
      const buffer = await logo.arrayBuffer();
      // Convert buffer to bytes string for uploading to s3
      const bytes = Buffer.from(buffer);

      const uploadOperations = [
        uploadToS3(bytes, "store_images"),
        ...(keyToDelete ? [deleteFromS3(keyToDelete)] : []),
      ];

      // Pass buffer to s3 to get image-url for storing in database
      [logoUrl] = await Promise.all(uploadOperations);
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
        slug: context.params.storeslug,
      },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        title,
        logo_url: logoUrl || logo_url,
        ref_link,
        isFeatured: isFeatured === "yes" ? true : false,
        addToPopularStores: addToPopularStores === "yes" ? true : false,
        description: description ? description : null,
        moreAbout: moreAbout ? moreAbout : null,
        hint: hint ? hint : null,
        hintHeading: hintHeading ? hintHeading : null,
        faq: JSON.stringify(faq),
        average_discount: average_discount,
        best_offer: best_offer,
        similarStores: {
          connect: similarStores.map((store: string) => ({
            storeId: Number(store),
          })),
        },
      },
    });

    // Return response on success
    return NextResponse.json({ success: true, updatedStore }, { status: 200 });
  } catch (error) {
    console.error(error);
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
