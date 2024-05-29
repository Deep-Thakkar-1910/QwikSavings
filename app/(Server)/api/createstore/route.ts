import { NextResponse } from "next/server";

import { UploadStoreImage } from "@/lib/utilities/CloudinaryConfig";
import db from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// api handler to create store
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const logo = (formData.get("logo") as File) ?? null;
    const request = (await formData.get("data")) as string;
    const body = await JSON.parse(request);
    let logoUrl;

    if (logo) {
      console.log("entered upload function");
      // if there is a logo in the form data
      // converting the image to a buffer
      const buffer = await logo.arrayBuffer();
      // converting buffer to bytes string for uploading to cloudinary
      const bytes = Buffer.from(buffer);
      // passing buffer to Cloudinary to get image-url for storing in database
      logoUrl = (await UploadStoreImage(bytes)) as unknown as string;
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

    // extracting required properties
    const { name, title, ref_link, type, description, moreAbout, hint, faq } =
      body;

    // creating a new store
    const store = await db.store.create({
      data: {
        name,
        title,
        logo_url: logoUrl,
        ref_link,
        type,
        description,
        moreAbout,
        hint,
        faq: JSON.stringify(faq),
      },
    });

    // returning response on success
    return NextResponse.json({ success: true, store }, { status: 201 });
  } catch (error) {
    // unique constraint failed
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Store Already Exists",
        },
        { status: 400 },
      );
    }

    // general error response
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
