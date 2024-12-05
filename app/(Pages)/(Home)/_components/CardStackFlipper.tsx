"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCardFlipperData } from "@/hooks/useCardFlipperData";
import axios from "@/app/api/axios/axios";
import { useRouter } from "next/navigation";
import { constructS3Url } from "@/lib/utilities/AwsConfig";

const CardStackFlipper = ({ autoplay }: { autoplay: boolean }) => {
  const { data, error } = useCardFlipperData();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  // memoize data array
  const memoData = useMemo(() => data, [data]);

  // set active index of the card
  const handleNextClick = () => {
    setActiveIndex((cur) => (cur + 1) % memoData.length);
  };

  const handleCardGetClick = async (coupon: any) => {
    try {
      // Update coupon user count
      await axios.post("/updatecouponusercount", { couponId: coupon.couponId });

      // Encode coupon data
      const encodedCoupon = encodeURIComponent(
        JSON.stringify({
          isCouponFromHome: true,
          couponId: coupon.couponId,
          coupon_code: coupon.coupon_code,
          logo: coupon.store.logo_url,
          type: coupon.type,
          title: coupon.title,
          ref_link: coupon.ref_link,
        }),
      );
      // Construct store URL with encoded coupon data
      const storeUrl = `/stores/${coupon.store.name}?coupon=${encodedCoupon}`;

      // Redirect to the store page
      router.push(storeUrl);
    } catch (error) {
      console.error("Error handling image click:", error);
    }
  };

  // memoize the size of the data array
  const size = useMemo(() => memoData.length, [memoData]);

  // for autoplay of the flipper
  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setActiveIndex((cur) => (cur + 1) % size);
    }, 5000);

    // whenever the active index changes, clear the timer to reset the timer
    return () => clearInterval(timer);
  }, [size, autoplay, activeIndex]);

  // setting the factor of card stacks
  const map = useMemo(() => {
    const map = new Map();
    const len = memoData.length;
    let i = len;
    if (len < activeIndex || activeIndex < 0)
      throw new Error("Invalid index set as active index");

    while (i > 0) {
      map.set((activeIndex + len - i) % len, --i);
    }

    return map;
  }, [activeIndex, memoData]);

  if (!data || data.length === 0 || error) return null;
  return (
    <AnimatePresence mode="sync" initial>
      <div className={`relative hidden h-fit w-fit p-2 lg:inline-flex`}>
        {memoData.map((card, i) => {
          const factor = size - 1 - map.get(i);
          return (
            <motion.div
              key={card.couponId}
              initial={{
                opacity: 1 - i,
                scale: 0.9,
                zIndex: -1,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: 1,
                scale: i === activeIndex ? 1 : 1 - 0.075 * factor,
                zIndex: map.get(i),
                x: i === activeIndex ? 0 : factor * 25,
                y: i === activeIndex ? 0 : factor * 2,
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
              exit={{
                scale: 0.8,
                zIndex: -1,
                x: "100%",
                transition: { duration: 0.8, ease: "easeInOut" },
              }}
              className={cn(
                `absolute -left-[19rem] -top-4 h-72 w-60 rounded-xl bg-cover bg-no-repeat transition-colors duration-700 ease-in-out xl:-left-72 xl:h-80 2xl:-left-64 `,
                i === 0 && "bg-[#fff2cf]",
                i === 1 && "bg-[#e1b9ea]",
                i === 2 && "bg-[#b9e1ea]",
                i === 3 && "bg-[#FFB1B1]",
              )}
            >
              <div className="mt-5 flex flex-col items-center justify-center gap-5 xl:mt-8">
                <div className="flex flex-col items-center gap-y-4">
                  <Image
                    src={
                      constructS3Url(card.store.logo_url) ??
                      "https://via.placeholder.com/600x400"
                    }
                    alt={`Logo ${i}`}
                    width={1920}
                    height={1080}
                    className="size-12 rounded-full"
                  />
                  <Image
                    src={
                      constructS3Url(card.flipperImage_url) ??
                      "https://via.placeholder.com/600x400"
                    }
                    alt={`Logo ${i}`}
                    width={1920}
                    height={1080}
                    className="h-20 w-32 rounded-sm"
                  />
                </div>

                <p className="mx-auto h-16 overflow-hidden text-center text-base font-medium dark:text-zinc-900">
                  {card.title}
                </p>
              </div>

              <div
                className="absolute bottom-5 right-5 cursor-pointer rounded-full bg-app-main p-2 text-white transition-all duration-300 ease-linear dark:text-slate-200 xl:bottom-8 "
                onClick={handleNextClick}
              >
                <ChevronRight className="size-6" />
              </div>
              <button
                className="ease-linearhover:shadow-md absolute bottom-5 left-5 z-10 rounded-lg bg-app-main p-1 px-5 text-lg  text-white transition-all duration-300 dark:text-slate-200 xl:bottom-8 "
                onClick={() => {
                  handleCardGetClick(card);
                }}
              >
                GET NOW
              </button>
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
};

export default CardStackFlipper;
