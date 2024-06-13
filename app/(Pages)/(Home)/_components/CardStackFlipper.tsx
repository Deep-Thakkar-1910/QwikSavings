"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CardData } from "@/lib/utilities/CardFlipperData";

interface CardStackFlipperProps {
  data: CardData[];
  autoplay?: boolean;
}

const CardStackFlipper = ({ data, autoplay }: CardStackFlipperProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // memoize data array
  const memoData = useMemo(() => data, [data]);

  // set active index of the card
  const handleNextClick = () => {
    setActiveIndex((cur) => (cur + 1) % memoData.length);
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

  if (!data || data.length === 0) return null;
  return (
    <div className={`relative hidden h-fit w-fit lg:inline-block`}>
      <AnimatePresence mode="popLayout">
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
                `absolute h-80 w-60 rounded-lg bg-cover bg-no-repeat transition-colors duration-700 ease-in-out `,
                i === 0 && "bg-[#fff2cf]",
                i === 1 && "bg-[#e1b9ea]",
                i === 2 && "bg-[#b9e1ea]",
                i === 3 && "bg-[#FFB1B1]",
              )}
            >
              <div className="mt-5 flex flex-col items-center justify-center gap-5 xl:mt-8">
                <div className="flex flex-col items-center gap-y-4">
                  <Image
                    src={card.store.logo_url}
                    alt={`Logo ${i}`}
                    width={1920}
                    height={1080}
                    className="size-12 rounded-full"
                  />
                  <Image
                    src={card.flipperImage_url}
                    alt={`Logo ${i}`}
                    width={1920}
                    height={1080}
                    className="h-20 w-32 rounded-sm"
                  />
                </div>

                <p className="h-16 overflow-hidden text-xl dark:text-zinc-900">
                  {card.title}
                </p>
              </div>

              <div
                className="absolute bottom-5 right-5 cursor-pointer rounded-full bg-stone-100 p-2 transition-all duration-300 ease-linear hover:bg-app-bg-main hover:text-zinc-800 hover:shadow-md dark:text-background xl:bottom-8 "
                onClick={handleNextClick}
              >
                <ChevronRight className="size-6" />
              </div>
              <button className="ease-linearhover:shadow-md absolute bottom-5 left-5 z-10 rounded-lg bg-[#28538f] p-1 px-5 text-lg  text-slate-200 transition-all duration-300 xl:bottom-8 ">
                GET NOW
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CardStackFlipper;
