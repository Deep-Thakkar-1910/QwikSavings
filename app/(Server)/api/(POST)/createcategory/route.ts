import db from "@/lib/prisma";
import { UploadStoreImage } from "@/lib/utilities/CloudinaryConfig";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

// API handler for creating a category
export async function POST(req: Request) {
  const formData = await req.formData();
  const logo: File | null = (formData.get("logo") as File) ?? null;
  const request = (await formData.get("data")) as string;
  const body = await JSON.parse(request);
  console.log(logo);
  // extracting the name out of body
  const { name, stores, description, similarCategories } = body;
  try {
    let logoUrl;

    // if there is a logo in the form data
    if (logo) {
      // converting the image to a buffer
      const buffer = await logo.arrayBuffer();
      // converting buffer to bytes string for uploading to cloudinary
      const bytes = Buffer.from(buffer);
      // passing buffer to Cloudinary to get image-url for storing in database
      logoUrl = (await UploadStoreImage(
        bytes,
        "category_images",
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

    // creating the categroy
    const category = await db.category.create({
      data: {
        name,
        description: description ? description : null,
        logo_url: logoUrl,
        stores:
          stores.length > 0
            ? {
                connect: stores.map((store: string) => ({
                  storeId: Number(store),
                })),
              }
            : undefined,
        similarCategories:
          similarCategories.length > 0
            ? {
                connect: similarCategories.map((category: string) => ({
                  categoryId: Number(category),
                })),
              }
            : undefined,
      },
    });

    // returning  response on success
    return NextResponse.json(
      {
        success: true,
        category,
        message: "Category created successfully",
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
            error: `Category with the name ${name} already exists`,
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
