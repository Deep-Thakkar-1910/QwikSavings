import { useEffect, useState } from "react";
import axios from "@/app/api/axios/axios";

export interface CarouselImageItem {
  couponId: number;
  carouselPosterUrl: string;
}

export function useImageCarouselData(): {
  data: CarouselImageItem[];
  isLoading: boolean;
  error: any;
} {
  const [data, setData] = useState<CarouselImageItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchImageCarouselData = async () => {
      try {
        const response = await axios.get(
          `/getcarouselcoupons?_=${new Date().getTime()}`,
        );
        setData(response.data.carouselCoupons);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImageCarouselData();
  }, []);

  return { data, isLoading, error };
}
