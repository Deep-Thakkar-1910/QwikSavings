"use client";
import { useActiveFestival } from "@/hooks/useFestivalActive";
import Image from "next/image";

const AboutUs = () => {
  const isActive = useActiveFestival((state) => state.isActive);
  return (
    <section className={` bg-popover py-6 ${isActive ? "!mb-8" : ""}`}>
      <div className="mx-auto flex max-w-screen-xl flex-col px-8 sm:px-10 lg:flex-row lg:px-12 xl:px-6 2xl:px-0">
        <div className="flex w-full flex-col items-start gap-4 text-justify lg:w-1/2">
          <h2 className="mx-auto text-start text-xl font-bold sm:text-2xl">
            Qwik Savings - Shop Smarter, Save Faster
          </h2>

          <div className="text-lg font-medium">
            There is nothing more disappointing than finding an exciting code
            only to find it not working at checkout. So, to save you from this,
            our team at Qwik Savings, works meticulously to ensure that you only
            get the most authentic and working coupon codes to shop along. Every
            single code added to our website is checked thoroughly to make sure
            that you aren&apos;t disappointed.
          </div>

          <div className="text-md text-gray-800 dark:text-muted-foreground">
            We are always ready to go one extra mile to deliver on the promise
            we make to you, so be ensured that all that you see on our platform
            is totally functional. We take pride in our system of delivery, thus
            each of the codes we provide has a name attached to it, to prove our
            trust and reliability. We are confident that whatever coupons you
            see on our portal will be delivered to you as it is.
          </div>

          <div className="text-md text-gray-800 dark:text-muted-foreground ">
            In a rare instance, where the coupon code falls short, we promise
            you a guaranteed gift card as a part of our acknowledgement of the
            issue and gratitude towards you for sticking alongside us.
          </div>

          <div className="text-md text-gray-800 dark:text-muted-foreground">
            Apart from lending a hand in saving you money through our
            brilliantly cost effective coupon codes, we even guide you towards a
            path of a simplified and hassle free online shopping experience
            through our helpful tips, shopping guides and you can even get to
            know the brands we work with and whose deals we offer to you. Learn
            exactly how to apply the provided coupon code to make sure you
            don&apos;t face any delay during checkouts.
          </div>
        </div>

        <Image
          src={"/AboutUs/about.png"}
          alt="About Us Picture"
          width={2000}
          height={2000}
          loading="eager"
          className="w-full lg:w-1/2"
        />
      </div>
    </section>
  );
};

export default AboutUs;
