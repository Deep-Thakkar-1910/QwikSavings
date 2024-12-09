import { authOptions } from "@/lib/AuthOptions";
import db from "@/lib/prisma";
import {
  deleteMultipleFilesFromS3,
  uploadToS3,
} from "@/lib/utilities/AwsConfig";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// API handler for creating a category
export async function PUT(
  req: Request,
  context: { params: { eventslug: string } },
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
  const { eventslug } = context.params;
  const formData = await req.formData();

  const logo: File | null = (formData.get("logo_url") as File) ?? null;
  const cover: File | null = (formData.get("cover_url") as File) ?? null;
  const request = (await formData.get("data")) as string;
  const body = await JSON.parse(request);

  const { name, slug, description, title, keyToDeleteLogo, keyToDeleteCover } =
    body;

  let { logoUrl, coverUrl } = body;

  try {
    // Handle file uploads and deletions in one flow
    const uploadPromises = [];
    const deleteKeys = [];

    // Logo logic: Upload new, delete old, or set null
    if (logo) {
      const logoBuffer = Buffer.from(await logo.arrayBuffer());
      uploadPromises.push(uploadToS3(logoBuffer, "event_images"));
      if (keyToDeleteLogo) deleteKeys.push({ Key: keyToDeleteLogo });
    } else if (keyToDeleteLogo) {
      deleteKeys.push({ Key: keyToDeleteLogo });
      logoUrl = null; // Set to null in DB if deleted
    }

    // Cover logic: Upload new, delete old, or set null
    if (cover) {
      const coverBuffer = Buffer.from(await cover.arrayBuffer());
      uploadPromises.push(uploadToS3(coverBuffer, "event_images"));
      if (keyToDeleteCover) deleteKeys.push({ Key: keyToDeleteCover });
    } else if (keyToDeleteCover) {
      deleteKeys.push({ Key: keyToDeleteCover });
      coverUrl = null; // Set to null in DB if deleted
    }

    // Perform uploads (if any)
    const uploadResults = await Promise.all(uploadPromises);

    // Assign upload results based on their order
    if (logo) logoUrl = uploadResults.shift(); // First result is logo upload
    if (cover) coverUrl = uploadResults.shift(); // Second result is cover upload

    // Perform deletions after successful uploads
    if (deleteKeys.length > 0) {
      await deleteMultipleFilesFromS3(deleteKeys);
    }

    // Update the event in the database
    const updatedEvent = await db.event.update({
      where: { slug: eventslug },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description,
        title,
        logo_url: logoUrl,
        cover_url: coverUrl,
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
    console.error(error);

    // if unique constraint failed
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Event with the name ${name}  or slug ${slug} already exists`,
        },
        { status: 400 },
      );
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
