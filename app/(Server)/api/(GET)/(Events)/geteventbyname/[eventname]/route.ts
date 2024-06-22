import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(
  req: Request,
  context: { params: { eventname: string } },
) {
  try {
    const { eventname } = context.params;
    const eventDetails = await db.event.findUnique({
      where: {
        name: eventname,
      },
      include: {
        coupons: {
          select: {
            couponId: true,
            due_date: true,
            description: true,
            ref_link: true,
            type: true,
            title: true,
            user_count: true,
            store: {
              select: {
                logo_url: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json({ success: true, eventDetails }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "Error fetching Event details" },
      { status: 500 },
    );
  }
}
