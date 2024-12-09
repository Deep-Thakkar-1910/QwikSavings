import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export async function GET() {
  try {
    const activeFestival = await db.festival.findFirst({
      where: {
        activated: true,
      },
      include: {
        store: {
          select: {
            slug: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, activeFestival });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
