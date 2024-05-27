import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // extracting the name out of body
    const { name } = body;

    // creating the categroy
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    // returning  response on success
    return NextResponse.json({
      success: true,
      category,
      message: "Category created successfully",
    });
  } catch (error) {
    // if Unique constraint failed
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error: "Category with this name already exists.",
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
