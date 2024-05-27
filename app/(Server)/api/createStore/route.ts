import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// api handler to create store
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // extracting required properties
    const {
      name,
      title,
      logo_url,
      ref_link,
      type,
      description,
      moreAbout,
      hint,
      faq,
    } = body;

    // creating a new store
    const store = await prisma.store.create({
      data: {
        name,
        title,
        logo_url,
        ref_link,
        type,
        description,
        moreAbout,
        hint,
        faq,
      },
    });

    // returning response on success
    return NextResponse.json({ success: true, store });
  } catch (error) {
    // error response
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
