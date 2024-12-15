import { Ads } from "@/lib/utilities/AdvertiseWithUs";
import Image from "next/image";
import AdvertiseWithUsForm from "./_AdvertiseWithUsComponent/AdvertiseWithUsForm";

const AdvertiseWithUsPage = () => {
  return (
    <section className="mb-10 flex w-full flex-col items-center gap-y-6 lg:items-start">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-8 sm:text-2xl lg:px-24 xl:px-16 2xl:px-8">
        <h1 className="text-xl font-bold sm:text-2xl">Advertise With Us</h1>
      </div>
      <div className="mx-auto w-full max-w-screen-xl px-4 text-lg sm:px-8 sm:text-2xl lg:px-12 xl:px-8 2xl:px-0">
        <div className="w-full text-lg lg:-mt-20 lg:ml-2 lg:p-5 lg:pt-0">
          <Image
            className="h-auto w-full  lg:float-right lg:m-10 lg:mr-0 lg:mt-0 lg:w-[45%]"
            src={"/AdvertiseWithUs/Advertise With Us.jpg"}
            alt="Advertise With Us Logo"
            width={2000}
            height={2000}
          />
          <p className="text-justify lg:mt-20">
            At Qwik Savings, we offer prime advertising opportunities to elevate
            your brand visibility. Partner with us to showcase your products or
            services to our engaged audience of thousands.
          </p>
          <div className="my-5 text-xl lg:text-2xl">Why Advertise With Us?</div>
          <ul className="list-disc pl-5 text-justify">
            {Ads.map((ele, index) => (
              <li key={index} className="my-5">
                <span className="inline font-bold">{ele.text}:</span>
                <span className="whitespace-wrap hyphens-auto">
                  {" "}
                  {ele.content}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <article className="mx-auto my-8 flex flex-col items-center justify-center gap-8 px-4 sm:px-8 lg:px-12 ">
        <div className="mb-2 flex  w-11/12 max-w-screen-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar md:w-full lg:flex-row lg:items-center lg:justify-between ">
          {/* Form container div */}
          <div className="flex w-full flex-col gap-y-4">
            <h1 className="text-xl font-bold">Ready To Get Started?</h1>
            <p className="text-justify">
              Fill out the form below to kickstart your advertising journey with
              Qwik Savings. Let&apos;s collaborate and create impactful
              campaigns that drive results. Your success is our priority, and
              we&apos;re here to help you achieve your advertising goals. Join
              us today to unlock a world of advertising possibilities!
            </p>
            <AdvertiseWithUsForm />
          </div>
        </div>
      </article>
    </section>
  );
};

export default AdvertiseWithUsPage;
