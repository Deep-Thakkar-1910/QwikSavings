import { authOptions } from "@/lib/AuthOptions";
import db from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { festivalId: string } },
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
  const { festivalId } = params;
  try {
    await db.festival.update({
      where: {
        festivalId: Number(festivalId),
      },
      data: {
        activated: false,
      },
    });
    return NextResponse.json({
      success: true,
      message: "Festival Deactivated",
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // Handle Prisma-specific errors
      if (err.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Festival not found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while activating the festival",
      },
      { status: 500 },
    );
  }
}
