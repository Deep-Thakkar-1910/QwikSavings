import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";
import { set } from "date-fns";
import { useEffect, useState } from "react";

interface useGetDetailsProps {
  fetchFrom: string;
  id: string;
}

const useGetDetails = ({ fetchFrom, id }: useGetDetailsProps) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setisLoading(true);
    setError("");
    // function to fetch page data
    const fetchPageData = async () => {
      try {
        const ItemData = await axios.get(`/get${fetchFrom}byid/${id}`);
        const ItemResult = ItemData.data;
        if (ItemResult.success) {
          const details = ItemResult[`${fetchFrom}Details`];
          setData(details);
          setisLoading(false);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data.error);
          setisLoading(false);
        }
      } finally {
        setisLoading(false);
      }
    };
    // calling the function to fetch page data
    fetchPageData();
  }, [id, fetchFrom]);

  return { data, isLoading, error };
};

export default useGetDetails;
