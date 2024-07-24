import { useEffect, useState } from "react";
import axios from "@/app/api/axios/axios";

export interface CardData {
  couponId: string;
  flipperImage_url: string;
  title: string;
  store: { name: string; logo_url: string };
}

export function useCardFlipperData(): {
  data: CardData[];
  isLoading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/getflippercoupons?_=${new Date().getTime()}`,
        );
        setData(response.data.flipperCoupons);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching carousel data:", error);
        setError("Error fetching carousel data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}