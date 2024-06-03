import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface HookData {
  data: Record<string, any>[];
  isLoading: boolean;
  like: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  error: string | undefined;
  setLike: React.Dispatch<React.SetStateAction<string>>;
}

const useFilter = (fetchFrom: string): HookData => {
  const [page, setPage] = useState<number>(1);
  const [like, setLike] = useState<string>("");
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsLoading(true);
    setError(undefined);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/getdisplay${fetchFrom}?page=${page}&like=${like}`,
        );
        const data: Record<string, any>[] = response.data[fetchFrom];
        setData(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AxiosError) setError(err.response?.data.error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, like, fetchFrom]);
  return { data, isLoading, error, page, setPage, like, setLike };
};

export { useFilter };
