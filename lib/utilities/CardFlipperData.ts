"use server";
import axios from "@/app/api/axios/axios";

export interface CardData {
  couponId: string;
  flipperImage_url: string;
  title: string;
  store: { name: string; logo_url: string };
}

export async function fetchCardFlipperData(): Promise<CardData[]> {
  try {
    const response = await axios.get("/getflippercoupons");
    return response.data.flipperCoupons;
  } catch (error) {
    console.error("Error fetching carousel data:", error);
    return [];
  }
}
