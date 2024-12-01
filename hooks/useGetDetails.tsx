import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface useGetDetailsProps {
  fetchFrom: string;
  slug: string;
}

const useGetDetails = ({ fetchFrom, slug }: useGetDetailsProps) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [initialCoupon, setInitialCoupon] = useState<string>("");
  useEffect(() => {
    setisLoading(true);
    setError("");
    // function to fetch page data
    const fetchPageData = async () => {
      try {
        const ItemData = await axios.get(`/get${fetchFrom}byslug/${slug}`);
        const ItemResult = ItemData.data;
        if (ItemResult.success) {
          const details = ItemResult[`${fetchFrom}Details`];
          setData(details);
          setInitialCoupon(details?.coupons[0]?.due_date);
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
  }, [slug, fetchFrom]);

  return { data, isLoading, error, initialCoupon };
};

export default useGetDetails;
