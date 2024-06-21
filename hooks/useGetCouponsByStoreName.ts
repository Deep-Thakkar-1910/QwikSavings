import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface HookData {
  data: Record<string, any>[];
  isLoading: boolean;
  like: string | null;
  totalCount: number;
  error: string | undefined;
  setLike: React.Dispatch<React.SetStateAction<string | null>>;
}

const useGetCouponsByStoreName = (): HookData => {
  const [like, setLike] = useState<string | null>(null);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsLoading(true);
    setError(undefined);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/getcouponsbystore?storeName=${like}`,
        );
        const data = response.data.coupons;
        const total = response.data.totalCount;
        setData(data);
        setTotalCount(total);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError) setError(err.response?.data.error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [like]);
  return { data, isLoading, error, totalCount, like, setLike };
};

export default useGetCouponsByStoreName;
