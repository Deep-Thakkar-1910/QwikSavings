import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import db from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const bookmarkedCoupons = await db.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        coupon: {
          include: {
            store: {
              select: {
                name: true,
                slug: true,
                logo_url: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedCoupons = bookmarkedCoupons.map((bookmark: any) => ({
      id: bookmark.coupon.couponId,
      title: bookmark.coupon.title,
      description: bookmark.coupon.description,
      couponCode: bookmark.coupon.coupon_code,
      thumbnailUrl: bookmark.coupon.thumbnail_url,
      type: bookmark.coupon.type,
      refLink: bookmark.coupon.ref_link,
      dueDate: bookmark.coupon.due_date,
      userCount: bookmark.coupon.user_count,
      likeCount: bookmark.coupon.like_count,
      dislikeCount: bookmark.coupon.dislike_count,
      storeName: bookmark.coupon.store.name,
      storeSlug: bookmark.coupon.store.slug,
      storeLogo: bookmark.coupon.store.logo_url,
      categoryName: bookmark.coupon.category.name,
    }));

    return NextResponse.json({
      success: true,
      bookmarkedCoupons: formattedCoupons,
    });
  } catch (error) {
    console.error("Error fetching bookmarked coupons:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
