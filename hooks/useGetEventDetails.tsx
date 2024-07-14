import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";

type EventData = Record<string, any>;

const useGetEventDetails = (eventName: string) => {
  const [data, setData] = useState<EventData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialCoupon, setInitialCoupon] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`geteventbyname/${eventName}`);
        if (response.data.success) {
          setData(response.data.eventDetails);
          setInitialCoupon(response.data?.eventDetails?.coupon[0]?.due_date);
          console.log(response.data);
        }
      } catch (error) {
        if (error instanceof AxiosError) setError(error.response?.data.error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [eventName]);

  return { data, isLoading, error, initialCoupon };
};

export default useGetEventDetails;
