import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";

export async function DELETE(
  req: Request,
  { params }: { params: { festivalId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = params.festivalId;

    const festivalId = Number(id);

    await db.festival.delete({
      where: { festivalId },
    });

    return NextResponse.json({
      success: true,
      message: "Festvial deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
