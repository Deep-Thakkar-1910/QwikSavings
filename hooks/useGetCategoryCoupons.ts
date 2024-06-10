import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";

export interface Coupon {
  store: Record<string, any>;
  category: Record<string, any>;
  coupon_code: string;
  type: string;
  title: string;
  isVerified: boolean;
  user_count: number;
}

const useGetCategoryCoupons = (categoryName: string) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await axios(
          `/getcouponsbycategory?categoryName=${categoryName}`,
        );

        if (response.data.success) {
          setData(response.data);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data.error);
        }
        if (err instanceof Error) {
          setError((err as Error).message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryName) {
      fetchCoupons();
    }
  }, [categoryName]);

  return { data, error, isLoading };
};

export default useGetCategoryCoupons;
