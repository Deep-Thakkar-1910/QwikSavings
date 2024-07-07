import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const unverifiedCoupons = await db.userSubmittedCoupon.findMany({
      where: { isVerified: false },
      include: { store: true, category: true },
    });

    return NextResponse.json(
      { success: true, unverifiedCoupons },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
