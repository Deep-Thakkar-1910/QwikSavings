import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(
  req: Request,
  context: { params: { festivalId: string } },
) {
  try {
    const { festivalId } = context.params;
    const festivalDetails = await db.festival.findUnique({
      where: {
        festivalId: Number(festivalId),
      },
    });

    return NextResponse.json(
      { success: true, festivalDetails },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "Error fetching festival details" },
      { status: 500 },
    );
  }
}
