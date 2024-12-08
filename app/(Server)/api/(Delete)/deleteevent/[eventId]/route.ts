import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { deleteMultipleFilesFromS3 } from "@/lib/utilities/AwsConfig";

export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const deleteList: { Key: any }[] = [];
    const deletePromises = [];

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = params.eventId;

    const eventId = Number(id);

    const event = await db.event.findUnique({
      where: { eventId },
      select: {
        logo_url: true,
        cover_url: true,
      },
    });

    if (event?.logo_url) {
      deleteList.push({ Key: event.logo_url });
    }

    if (event?.cover_url) {
      deleteList.push({ Key: event.cover_url });
    }

    deletePromises.push(
      db.event.delete({
        where: { eventId },
      }),
    );

    deletePromises.push(deleteMultipleFilesFromS3(deleteList));

    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
