import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";
import { set } from "date-fns";
import { useEffect, useState } from "react";

interface useGetDetailsProps {
  fetchFrom: string;
  name: string;
}

const useGetDetails = ({ fetchFrom, name }: useGetDetailsProps) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setisLoading(true);
    setError("");
    // function to fetch page data
    const fetchPageData = async () => {
      try {
        const ItemData = await axios.get(`/get${fetchFrom}byname/${name}`);
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
  }, [name, fetchFrom]);

  return { data, isLoading, error };
};

export default useGetDetails;
