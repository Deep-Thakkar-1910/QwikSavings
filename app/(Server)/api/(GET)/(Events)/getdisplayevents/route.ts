// Api handler to get Events For display

import db from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const events = await db.event.findMany({
      select: {
        eventId: true,
        name: true,
        slug: true,
        logo_url: true,
        coupons: {
          select: {
            type: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    const totalCount = await db.event.count();
    return NextResponse.json(
      { success: true, events, totalCount },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);

    if (err instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
