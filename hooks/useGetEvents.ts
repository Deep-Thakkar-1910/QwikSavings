import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

interface HookData {
  data: Record<string, any>[];
  setData: Dispatch<SetStateAction<Record<string, any>[]>>;
  isLoading: boolean;
  totalCount: number;
  setTotalCount: Dispatch<SetStateAction<number>>;
  error: string | null;
}

const useGetEvents = (): HookData => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const response = await axios.get("/getdisplayevents");
        if (response.data.success) {
          setData(response.data.events);
          setTotalCount(response.data.totalCount);
        }
      } catch (error) {
        if (error instanceof AxiosError) setError(error.response?.data.error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { isLoading, error, data, setData, totalCount, setTotalCount };
};

export default useGetEvents;
