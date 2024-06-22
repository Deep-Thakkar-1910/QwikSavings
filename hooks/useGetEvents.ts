import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";

const useGetEvents = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const response = await axios.get("/getdisplayevents");
        if (response.data.success) {
          setData(response.data.events);
        }
      } catch (error) {
        if (error instanceof AxiosError) setError(error.response?.data.error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { isLoading, error, data };
};

export default useGetEvents;
