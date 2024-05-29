"use client";
import { CarouselImageItem } from "@/lib/utilities/ImageCarouselData";
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
//
interface ImageCarouselProps {
  data: CarouselImageItem[];
}

const ImageCarousel = ({ data }: ImageCarouselProps) => {
  const plugin = useRef(Autoplay({ delay: 5000 }));
  return (
    <Carousel
      className="w-full lg:w-2/3"
      opts={{ loop: true }}
      plugins={[plugin.current]}
      onMouseEnter={() => plugin.current.stop()}
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent>
        {data.map((image, index) => (
          <CarouselItem key={index}>
            <Image
              src={image.ImageUrl}
              alt={`carousel image ${index + 1}`}
              width={1920}
              height={1080}
              className="size-full rounded-lg object-cover"
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
