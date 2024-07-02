import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetBlogDetails = (blogId: string | string[]) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    setisLoading(true);
    setError("");
    // function to fetch page data
    const fetchPageData = async () => {
      try {
        const ItemData = await axios.get(`/getblogbyid/${blogId}`);
        const ItemResult = ItemData.data;
        if (ItemResult.success) {
          setData(ItemResult.blogDetails);
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
  }, [blogId]);

  return { data, isLoading, error };
};

export default useGetBlogDetails;
