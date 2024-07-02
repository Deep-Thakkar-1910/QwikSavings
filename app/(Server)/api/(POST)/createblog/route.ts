import db from "@/lib/prisma";
import { UploadStoreImage } from "@/lib/utilities/CloudinaryConfig";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

// API handler for creating a blog
export async function POST(req: Request) {
  const formData = await req.formData();
  const thumbnail: File | null = (formData.get("thumbnail") as File) ?? null;
  const request = (await formData.get("data")) as string;
  const body = await JSON.parse(request);

  // extracting the fields out of body
  const { title, content } = body;

  try {
    let thumbnailUrl;

    // if there is a thumbnail in the form data
    if (thumbnail) {
      // converting the image to a buffer
      const buffer = await thumbnail.arrayBuffer();
      // converting buffer to bytes string for uploading to cloudinary
      const bytes = Buffer.from(buffer);
      // passing buffer to Cloudinary to get image-url for storing in database
      thumbnailUrl = (await UploadStoreImage(
        bytes,
        "blog_images",
      )) as unknown as string;
      if (!thumbnailUrl) {
        return NextResponse.json(
          {
            success: false,
            error: "Error uploading thumbnail",
          },
          { status: 500 },
        );
      }
    }

    // creating the blog
    const blog = await db.blog.create({
      data: {
        title,
        content,
        thumbnail_url: thumbnailUrl || "",
      },
    });

    // returning response on success
    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
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
            error: `Blog with the title "${title}" already exists`,
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
