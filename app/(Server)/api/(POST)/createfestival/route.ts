import db from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

// API handler for creating a blog
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // extracting the fields out of body
    const { title, name, store_id } = body;

    // creating the blog
    const blog = await db.festival.create({
      data: {
        title,
        name,
        storeId: Number(store_id),
      },
    });

    // returning response on success
    return NextResponse.json(
      {
        success: true,
        message: "Festival created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    // error response
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
