import db from "@/lib/prisma";
import { UploadStoreImage } from "@/lib/utilities/CloudinaryConfig";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: { categoryslug: string } },
) {
  const { categoryslug } = context.params;
  const formData = await req.formData();
  const logo = (formData.get("logo") as File) ?? null;
  const request = (await formData.get("data")) as string;
  const body = await JSON.parse(request);

  const { name, slug, description, logo_url, addToTodaysTopCategories } = body;

  try {
    let logoUrl;
    if (logo) {
      const buffer = await logo.arrayBuffer();
      const bytes = Buffer.from(buffer);
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
    const updatedCategory = await db.category.update({
      where: {
        slug: categoryslug,
      },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description ? description : null,
        logo_url: logoUrl || logo_url,
        addToTodaysTopCategories:
          addToTodaysTopCategories === "yes" ? true : false,
      },
    });
    return NextResponse.json(
      { success: true, updatedCategory },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Category with the name ${name} already exists`,
        },
        { status: 400 },
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
