import db from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

export async function PUT(
  req: Request,
  { params }: { params: { festivalId: string } },
) {
  const { festivalId } = params;
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
  try {
    await db.$transaction(async (tx) => {
      // Find a festival which is active
      const activeFestival = await tx.festival.findFirst({
        where: {
          activated: true,
        },
      });

      if (activeFestival) {
        // If any active festival found, deactivate it
        await tx.festival.update({
          where: {
            festivalId: activeFestival.festivalId,
          },
          data: {
            activated: false,
          },
        });
      }

      // Activate the new festival
      await tx.festival.update({
        where: {
          festivalId: parseInt(festivalId),
        },
        data: {
          activated: true,
        },
      });
    });

    return NextResponse.json(
      { success: true, message: "Festival activated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error activating festival:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      // Handle Prisma-specific errors
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: true, error: "Festival not found" },
          { status: 404 },
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while activating the festival",
      },
      { status: 500 },
    );
  }
}
