import { Button } from "@/components/ui/button";
import { FooterNavlinks } from "@/lib/utilities/FooterNavlinks";
import Image from "next/image";
import Link from "next/link";
import Socials from "./Socials";

const Footer = () => {
  return (
    <footer className="flex w-full flex-col gap-6 border-t-2 border-app-main bg-popover p-10 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-x-16">
        {/* Logo and motto */}
        <div className="flex w-2/3 flex-col items-center gap-y-4 lg:w-1/4">
          <Image
            src={"/Logos/FooterLogo.png"}
            alt="Qwik Savings Footer Logo"
            width={1920}
            height={1080}
            loading="eager"
            className="w-full max-w-64"
          />
          <p className="text-md mx-auto text-center lg:text-justify">
            Qwik Savings, as the name suggests, is your go-to destination for
            quick savings. It helps you save faster than other websites in the
            market by providing hand-tested coupon codes or offers. We guarantee
            that each of our codes works; if it doesn&apos;t, we&apos;ll give
            you a gift card so you can treat yourself on us.
          </p>
        </div>
        <div className="flex flex-col items-center gap-y-2 lg:translate-y-16 lg:items-start">
          <h3 className="text-xl font-bold">Useful Reads</h3>
          {FooterNavlinks["Useful Reads"].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-gray-800 transition-colors duration-300 ease-linear hover:text-app-main dark:text-muted-foreground"
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-center gap-y-2 lg:translate-y-16 lg:items-start">
          <h3 className="text-xl font-bold">Legal</h3>
          {FooterNavlinks.Legal.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-gray-800 transition-colors duration-300 ease-linear hover:text-app-main dark:text-muted-foreground"
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-center gap-y-6 lg:translate-y-16 lg:items-start">
          <h3 className="text-xl font-bold sm:text-2xl">Join Our Newsletter</h3>
          <p className="text-md mx-auto text-center text-muted-foreground lg:mx-0 lg:text-start">
            To get the verified and hand tested Coupons or deals alerts.
          </p>
          <div className="flex w-11/12 items-center justify-between rounded-full border-2 border-app-main pl-1 sm:w-full sm:pl-4 xl:w-10/12">
            <input
              type="text"
              placeholder="Enter Your Email Address"
              className="w-full border-none bg-transparent py-4 caret-red-600 outline-none placeholder:text-xs placeholder:text-muted-foreground sm:placeholder:text-base"
            />
            <Button className="rounded-br-full rounded-tr-full bg-app-main py-8">
              Subscribe
            </Button>
          </div>
          <p className="text-md mx-auto text-center text-muted-foreground lg:mx-0 lg:text-start">
            We&apos;ll never share your details.See our{" "}
            <span className="font-semibold text-black">Privacy Policy.</span>
          </p>
          <Socials />
        </div>
      </div>
      <div className="mx-auto h-px w-full max-w-screen-xl border-t border-dashed border-zinc-800"></div>
      <p className="mx-auto max-w-screen-xl text-center">
        Disclosure: If you buy a product or service through Qwik Savings, we may
        earn a commission
      </p>
      <p className="mx-auto max-w-screen-xl text-center">
        &copy; 2024 QwikSavings.com All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;