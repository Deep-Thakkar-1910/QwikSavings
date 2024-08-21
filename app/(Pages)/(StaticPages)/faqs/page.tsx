"use client";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FAQS } from "@/lib/utilities/FaqItems";
import { AccordionItem } from "@radix-ui/react-accordion";
import { ChevronRightCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FAQsPage = () => {
  return (
    <section className="mb-10 flex w-full flex-col items-center gap-y-4 lg:items-start lg:gap-y-6">
      <div className="mx-auto mt-2 w-full max-w-screen-xl px-4 sm:px-8 sm:text-2xl lg:mt-0 lg:px-12 2xl:px-0">
        <h1 className="text-xl font-bold sm:text-2xl">
          Frequently Asked Questions
        </h1>
      </div>
      <div className="mx-auto w-full max-w-screen-xl px-4 text-lg sm:px-8 sm:text-2xl lg:px-12 xl:px-8 2xl:px-0">
        <div className="flex flex-col items-center lg:flex-row lg:justify-around">
          <Image
            className="aspect-square w-full max-w-lg object-contain lg:w-2/5"
            src={"/FAQs/FAQs.png"}
            alt="FAQs Logo"
            width={2000}
            height={2000}
          />
          <div className="my-5 flex flex-col items-center gap-5 text-lg lg:w-2/5 lg:items-start">
            <span className="text-xl font-semibold lg:text-2xl">
              Need help?
            </span>
            <p className="text-justify">
              No worries….. we&apos;ve got you covered!!!
            </p>
            <p className="hyphens-auto text-justify">
              If you can&apos;t find what your looking for, contact us today so
              we can help you further.
            </p>
            <Button
              asChild
              className="w-fit bg-app-main transition-transform duration-300 ease-linear hover:-translate-y-1"
            >
              <Link href="/contactus">
                Contact Us <ChevronRightCircle className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-screen-xl px-4 text-lg sm:px-8 sm:text-2xl lg:px-12 2xl:px-0">
        <span className="text-xl font-bold lg:text-2xl">
          Common FAQs at Qwik Savings
        </span>
        <Accordion
          type="single"
          className="flex w-full flex-col gap-y-4 lg:p-5"
          collapsible
        >
          {FAQS.map((faq) => (
            <AccordionItem
              value={faq.id.toString()}
              key={faq.id}
              className="w-full rounded-md px-4 pt-10"
            >
              <AccordionTrigger className="w-full text-start text-lg font-bold sm:text-lg [&>.faq]:size-8">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4 text-sm sm:text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQsPage;
