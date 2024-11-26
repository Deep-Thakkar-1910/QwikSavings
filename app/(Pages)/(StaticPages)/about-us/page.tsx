import { Button } from "@/components/ui/button";
import { AboutUs } from "@/lib/utilities/AboutUsLinks";
import { ChevronRightCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <section className="mb-10 flex w-full flex-col items-start">
      <div className="mx-auto mt-6 w-full max-w-screen-xl px-4 sm:px-8 sm:text-2xl lg:px-12 xl:px-8 2xl:px-0">
        <h1 className="text-xl font-bold sm:text-2xl">About Qwik Savings</h1>
      </div>
      <div className="mx-auto w-full max-w-screen-xl px-4 text-lg sm:px-8 lg:px-12 lg:text-lg xl:px-8 2xl:px-0">
        <Image
          className="h-auto w-full lg:float-right lg:ml-10 lg:w-1/2"
          src={"/AboutusPage/AboutUs.jpg"}
          alt="About Us Logo"
          width={3000}
          height={2000}
        />
        <p className="my-5 text-justify lg:mt-10">
          True to its name, Qwik Savings is one of the most trusted sites for
          all online shopping fanatics who are looking to maximize their savings
          during their online shopping. With the company&apos;s authentic coupon
          codes and deals, customers are sure to experience an enriching
          shopping experience, full of crazy discounts for you to grab from.
          Qwik Savings has assembled a dedicated team of individuals that work
          endlessly towards finding the most money effective deals for your
          wallet.
        </p>
        <p className="my-5 text-justify">
          Not just that, the team dedicates and diverts its resources towards
          the right place to find when it comes to finding the right priced
          deals for their beloved customers. Ranging from technology, gadgets
          and sports to fashion, parenting and lifestyle, the company has its
          eyes set everywhere when it comes to finding the right pick of deals.
          All the deals brought forth by the skilled professionals of the
          company have a double check of genuineness that ensures trust and
          loyalty.
        </p>
        <p className="my-5 text-justify">
          The company&apos;s effortless and experienced commitment and hard work
          towards discovering the right and most efficient deals for the
          customers makes it an ideal destination to shop top brands from,
          saving both your time and money.
        </p>
      </div>
      <div className="mx-auto flex w-full  flex-col items-start justify-center gap-5 bg-popover p-20 px-4 sm:px-8 lg:px-12 xl:px-8 2xl:px-0">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 justify-items-stretch gap-5 sm:justify-items-center lg:grid-cols-3 lg:place-content-start">
          {AboutUs.map((ele, index) => (
            <div
              key={index}
              className="flex h-[420px]  flex-col items-center justify-center gap-4 rounded-2xl bg-app-bg-main px-5 shadow-lg dark:bg-app-dark sm:w-96 sm:max-w-xl lg:w-full"
            >
              <Image
                src={ele.img}
                alt={`${ele.text} Picture`}
                width={1672}
                height={1672}
                className="h-3/5 w-auto mix-blend-multiply dark:mix-blend-luminosity"
              />
              <div className="h-1/8 text-xl font-bold dark:text-muted-foreground lg:text-2xl">
                {ele.text}
              </div>
              <div className="h-1/8 text-xl font-bold dark:text-muted-foreground lg:text-2xl">
                {ele.content}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto w-full max-w-screen-xl px-4 py-5 text-lg sm:px-8 sm:text-2xl lg:px-12 lg:py-10 xl:px-8 2xl:px-0">
        <div className="w-full text-lg lg:ml-2 lg:p-5 lg:pt-0">
          <Image
            className="dark m-10 ml-0 h-auto w-full mix-blend-multiply dark:mix-blend-normal lg:float-left lg:w-1/2"
            src={"/AboutusPage/Our Mission and Vision.jpg"}
            alt="Our Mission and Vision Logo"
            width={3000}
            height={2000}
          />
          <span className="my-5 text-xl font-bold lg:text-2xl ">
            Our Mission & Vision
          </span>
          <p className="my-5 text-justify">
            Qwik Savings aims to be the most fonded destination for online
            shoppers to find the most legit and reliable coupon codes to provide
            them an ultimate shopping experience. The company is on a mission to
            curate a satisfying buying experience for everyone coming across
            them, sparing them from the frustration of expired or misleading
            deals.
          </p>
          <p className="my-5 text-justify">
            A massive believer of transparency among its users and itself, the
            company aspires to prioritize its users and present to them a
            collection of irresistible yet authentic offers. Qwik Savings also
            believes in total accessibility, thus having a very comfortable and
            compatible user interface. The company&apos;s ultimate mission is to
            foster a community of empowered customers and shoppers by providing
            them with the right tools and knowledge, i.e. their coupons, to make
            informed and cost effective decisions.
          </p>
        </div>
        <div className="w-full pt-0 text-lg lg:ml-2 lg:p-5">
          <Image
            className="h-auto w-full mix-blend-multiply dark:mix-blend-normal lg:float-right lg:m-10 lg:my-0 lg:mr-0 lg:w-[50%]"
            src={"/AboutusPage/How We Make Money.jpg"}
            alt="How We Make Money Logo"
            width={3000}
            height={2000}
          />
          <span className="my-5 text-xl font-bold lg:text-2xl ">
            How We Make Money
          </span>
          <p className="my-5 text-justify">
            Our revenue model goes way beyond just commissions. Our affiliate
            marketing model enables us to earn a small percentage of money
            through every purchase that you, shoppers, make using the deals and
            coupons from our platforms. We, along with our team work tirelessly
            to find and secure numerous brands and retailers to bring forth to
            you some exciting coupons and offers to take advantage of.
          </p>
          <p className="my-5 text-justify">
            Apart from that, we also earn through retailers willing to pay to
            get featured and advertised on our site and newsletters. Doing all
            this requires a lot of patience, time and effort, but we don’t mind
            that if it means fulfilling your online shopping experience.
          </p>
        </div>
      </div>
      <div className="mx-auto grid w-full place-items-center bg-popover px-4 text-lg sm:px-8 sm:text-2xl lg:px-12 xl:px-8 2xl:px-0">
        <div className="flex w-full max-w-screen-xl flex-col items-start justify-between pb-8 text-lg lg:ml-2 lg:flex-row lg:justify-center lg:p-5 lg:pt-0">
          <Image
            className="h-auto w-full mix-blend-multiply dark:mix-blend-normal lg:float-left lg:m-10 lg:my-0 lg:ml-0 lg:w-2/5"
            src={"/AboutusPage/Contact us.jpg"}
            alt="Contact Us Logo"
            width={2000}
            height={2000}
          />
          <div className="mt-10 flex h-full w-full flex-col items-center justify-between gap-3 lg:w-3/5 lg:items-start">
            <span className="text-xl font-bold lg:text-2xl">
              We&apos;re here to help
            </span>
            <p className="my-5 text-justify">
              If you&apos;re facing any troubles while using our website, Don
              &apos;t worry! We have supportive and friendly customer service
              always ready to resolve your issues with our website. Let us make
              your shopping and saving easy and convenient. Reach out to us now!
            </p>
            <Button
              asChild
              className="bg-app-main transition-transform duration-300 ease-linear hover:-translate-y-1"
            >
              <Link href="/contactus">
                Contact Us <ChevronRightCircle className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
