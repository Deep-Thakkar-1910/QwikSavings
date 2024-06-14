"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useImageCarouselData } from "@/hooks/useImageCarouselData";

const ImageCarousel = () => {
  const { data, isLoading, error } = useImageCarouselData();
  const plugin = useRef(Autoplay({ delay: 5000 }));
  if (!data || data.length === 0 || error) return null;
  return (
    <Carousel
      className="w-full lg:w-2/3 xl:w-3/4 2xl:-translate-x-6"
      opts={{ loop: true }}
      plugins={[plugin.current]}
      onMouseEnter={() => plugin.current.stop()}
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent className="max-h-80">
        {data.map((image, index) => (
          <CarouselItem key={image.carouselPosterUrl}>
            <Image
              src={image.carouselPosterUrl}
              alt={`carousel image ${index + 1}`}
              width={1920}
              height={1080}
              className="size-full rounded-lg object-fill"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant={"ghost"} />
      <CarouselNext variant={"ghost"} />
    </Carousel>
  );
};

export default ImageCarousel;
