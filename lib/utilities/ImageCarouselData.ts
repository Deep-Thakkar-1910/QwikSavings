"use server";
import axios from "@/app/api/axios/axios";

export interface CarouselImageItem {
  couponId: number;
  carouselPosterUrl: string;
}

export async function fetchImageCarouselData(): Promise<CarouselImageItem[]> {
  try {
    const response = await axios.get("/getcarouselcoupons");
    return response.data.carouselCoupons;
  } catch (error) {
    console.error("Error fetching carousel data:", error);
    return [];
  }
}
