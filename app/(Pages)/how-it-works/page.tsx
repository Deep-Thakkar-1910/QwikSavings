import { HowItWorksArray } from "@/lib/utilities/HowItWorks";
import Image from "next/image";
import Link from "next/link";

const HowItWorks = () => {
  return (
    <section className="mb-10 flex w-full flex-col items-center gap-y-6 lg:items-start">
      <div className="mx-auto mt-6 w-full max-w-screen-xl px-4 sm:px-8 sm:text-2xl lg:px-24 xl:px-16 2xl:px-8">
        <h1 className="text-xl font-bold sm:text-2xl">
          How to use coupons using the QwikSavings
        </h1>
      </div>
      <div className="mx-auto w-full max-w-screen-xl px-4 text-lg sm:px-8 sm:text-2xl lg:px-12 xl:px-8 2xl:px-0">
        <div className="flex w-full flex-col items-center text-lg lg:ml-2 lg:flex-row-reverse lg:items-start lg:p-5 lg:pt-0">
          <Image
            src={"/HowItWorks/How it Works.jpg"}
            alt="How it Works Logo"
            width={2000}
            className="aspect-square w-full max-w-80 object-contain mix-blend-multiply lg:w-1/3 lg:max-w-full lg:-translate-y-14"
            height={2000}
          />
          <div>
            <p className="my-5  text-center sm:text-start">
              Qwik Savings is your one stop platform to save your money. With a
              wide range of hand-tested coupon codes and deals, our platform
              connects you with the latest offers on your favorite brands. You
              can also find Black Friday, Cyber Monday, or Christmas like event
              coupons and deals which our dedicated team curates, allowing you
              to enjoy significant discounts throughout the year.
            </p>
            <p className="my-5  text-center sm:text-start">
              For those who love to shop smartly, a coupon is the ultimate
              solution. It allows you to indulge in everyday, occasional, and
              seasonal shopping without the hassle of bargaining. Now, you can
              have the joy of buying branded products at affordable prices with
              just a few clicks.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-8 sm:text-2xl lg:px-12 xl:px-8 2xl:px-0">
        <div className="mx-auto w-full text-center text-lg sm:mx-0 sm:text-start lg:ml-2 lg:p-5 lg:pt-0">
          <span className="text-2xl font-bold">1,2,3 easy steps</span>
          <p className="my-5  text-left sm:text-start">
            It&apos;s quick and easy to get started! Learn how our website works
            in less than 1 minute! Follow these easy steps to maximize your
            savings with our codes!
            <br />
            <br />
            <div>
              {HowItWorksArray.map((ele) => (
                <div key={ele.id} className="flex flex-col gap-2">
                  <span className="font-semibold">
                    <b>{ele.id}</b>&nbsp;&nbsp;
                    {ele.text} :
                  </span>
                  <p>{ele.content}</p>
                  <br />
                </div>
              ))}
            </div>
          </p>

          <p className="my-5  text-left">
            Love the savings? Share your experience with friends and family!
            Additionally, keep visiting QwikSavings.com for more amazing coupons
            and deals to continue saving on future purchases. If you have any
            problems or questions, please don&apos;t hesitate to get in touch
            with our team using the contact us page or by mailing at{" "}
            <Link
              href={"mailto:contact@qwiksavings.com"}
              className="text-app-main"
            >
              contact@qwiksavings.com
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
