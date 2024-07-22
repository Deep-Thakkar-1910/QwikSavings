import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";

export async function DELETE(
  req: Request,
  context: { params: { storeId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = context.params.storeId;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Store ID is required" },
        { status: 400 },
      );
    }

    const storeId = Number(id);

    await db.store.delete({
      where: { storeId },
    });

    return NextResponse.json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
