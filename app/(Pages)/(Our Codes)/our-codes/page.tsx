import Image from "next/image";
import Link from "next/link";

const OurCodesPage = () => {
  return (
    <section className=" mx-auto mb-10 flex w-full max-w-screen-xl flex-col items-center gap-6 px-4 font-medium sm:px-8 lg:items-start lg:px-12 xl:px-2 2xl:px-0">
      {/* Our Codes Intro Div */}
      <div className="w-full rounded-lg  p-10">
        <h1 className="text-center text-xl font-bold sm:text-2xl lg:text-start">
          Gift Card, If Not Code
        </h1>
        <div className="mt-6 flex flex-col items-center justify-end gap-6 text-lg lg:flex-row-reverse">
          <div className="flex w-full flex-col items-center lg:w-1/2">
            <Image
              src={"/OurCodes/Our-Codes.jpg"}
              alt="Our code Picture"
              width={5326}
              height={4776}
              className="size-full max-w-96 "
            />
            {/* <p className="mx-auto text-center text-base font-bold sm:text-xl  lg:place-self-end lg:text-end">
              All of Our Codes are Hand-Tested By Real People
            </p> */}
          </div>
          <div className="flex flex-col gap-y-6 text-center tracking-tighter sm:text-justify lg:w-1/2">
            <p>
              We understand the frustration of an inactive coupon
              code-there&apos;s nothing more disappointing than anticipating
              savings only to find the code doesn&apos;t work at checkout.
            </p>
            <p>
              Rest assured, we&apos;re confident that every online coupon code
              at Qwik Savings will deliver as promised. In the rare instance
              that one doesn&apos;t work, and you proceed with your purchase,
              consider it an opportunity for us to treat you. We&apos;ll provide
              a gift card to ensure you still get something special on us.
            </p>
            <p>
              Qwik Savings values your time and prioritizes your savings, thus
              making sure that we deliver on what we promise, and we pride
              ourselves for it. All of our codes are stringently sorted and
              negotiated with our partners. Additionally, we make sure to source
              our codes only from the official channels, testing them thoroughly
              to avoid any sort of administrative slip-ups and ensuring a
              seamless shopping experience for you.
            </p>
          </div>
        </div>
      </div>

      {/* How To Div */}
      <div className="w-full rounded-lg  p-10">
        <h1 className="text-center text-lg font-bold sm:text-xl lg:text-start lg:text-2xl">
          How you can get a gift card if the code does&apos;t work?
        </h1>
        <div className="mt-14 grid auto-cols-fr grid-cols-1 gap-6 sm:text-lg md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-start gap-y-6">
            <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
              1. Reveal the Coupon
            </h2>
            <p className="text-start  tracking-wide lg:text-justify">
              Simply click &apos;Get Code&apos; to reveal the coupon code, then
              proceed to purchase items that meet the offer&apos;s conditions.
              If in doubt, always refer to the condition by clicking on
              &apos;Show Details&apos; below the code for clarity.
            </p>
          </div>
          <div className="flex flex-col items-start gap-y-6">
            <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
              2. Inactive Code
            </h2>
            <div className="text-start tracking-wide lg:text-justify">
              <p>
                If the coupon code doesn&apos;t work, forward your online order
                confirmation or receipt by email to{" "}
              </p>
              <span className="break-words font-bold">
                <Link
                  className="break-all text-sky-500"
                  href={"mailto:claims@qwiksavings.com"}
                >
                  claims@qwiksavings.com
                </Link>{" "}
              </span>{" "}
              within 48 hours of making your order. Within your email, please
              also include:
              <br />
              <br />
              <ul className="ml-6 list-disc">
                <li>Your name and email address</li>
                <li>Name of online store or brands</li>
                <li>Screenshot of product ordered</li>
                <li>Purchase confirmation email</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-start gap-y-6 md:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
              3. Get a FREE Gift Card
            </h2>
            <p className="text-start  tracking-wide lg:text-justify">
              Our dedicated customer support team will review your claim within
              ten business days. If it meets the criteria, you&apos;ll receive a
              $10 gift card for the same online store where you made your
              purchase.
              <br />
              <br />
              Claims submitted after 48 hours from the purchase time will not be
              accepted.
            </p>
          </div>
        </div>
      </div>

      {/* Acceptable Code Div */}
      <div className="w-full rounded-lg  p-10">
        <h1 className="text-center text-xl font-bold sm:text-2xl lg:text-start">
          Acceptable Codes
        </h1>
        <div className="mt-6 flex flex-col items-center justify-end gap-6 lg:flex-row-reverse">
          <div className="flex w-full flex-col items-center lg:w-1/2">
            <Image
              src={"/OurCodes/OurCodesCoupon.png"}
              alt="Hand Tested Picture"
              width={5326}
              height={4776}
              className="size-full max-w-96 lg:max-w-full"
            />
            {/* <p className="mx-auto text-center text-base font-bold sm:text-xl  lg:place-self-end lg:text-end">
              All of Our Codes are Hand-Tested By Real People
            </p> */}
          </div>
          <div className="flex flex-col gap-y-6 text-center text-base tracking-tighter sm:text-justify lg:w-1/2 lg:text-lg">
            <p className="mt-6 text-center lg:text-start">
              Our codes guarantee applies specifically to online coupon codes.
              You can recognize these codes in two simple ways:
            </p>
            <h2 className="mt-6 text-center tracking-wide">- 1. Button</h2>
            <p className="mt-2">
              valid coupon code can be identified by the button used to display
              the code, which will typically say: &quot;Get Code.&quot;
            </p>
            <h2 className="mt-6 text-center tracking-wide">
              - 2. Checkout Page
            </h2>
            <p className="mt-2">
              A coupon code is used to make online purchases and save money. You
              can apply these codes by entering them into a designated box,
              often labeled as &quot;discount code,&quot; at the checkout stage
              to redeem your savings.
            </p>
          </div>
        </div>
      </div>

      {/* Unacceptable Code Div */}
      <div className="w-full rounded-lg  p-10">
        <div className="mb-6 flex flex-col items-center text-center">
          <h1 className="text-xl font-bold sm:text-2xl">Unacceptable Codes</h1>
          <p className="mt-4 text-sm sm:text-base">
            The following types of deals are not eligible under &quot;Our
            Codes&quot; guarantee:
          </p>
        </div>
        <div className="mt-6 flex flex-col items-center justify-end gap-6 lg:flex-row-reverse">
          <div className="flex flex-col gap-y-6 text-center text-lg  tracking-tighter sm:text-justify lg:w-1/2">
            <h2 className="mt-6 font-medium tracking-wide">1. Deals</h2>
            <p className="mt-2">
              Deals which do not require a code to secure the saving. These can
              be identified by the &quot;Get Deal&quot; button.
            </p>
          </div>
          <div className="flex w-full flex-col items-center lg:w-1/2">
            <Image
              src={"/OurCodes/OurCodesCoupon.png"}
              alt="Hand Tested Picture"
              width={5326}
              height={4776}
              className="size-full max-w-96 lg:max-w-full"
            />
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center justify-end gap-6 lg:flex-row-reverse">
          <div className="flex w-full flex-col items-center lg:w-1/2">
            <Image
              src={"/OurCodes/OurCodesCoupon.png"}
              alt="Hand Tested Picture"
              width={5326}
              height={4776}
              className="size-full max-w-96 lg:max-w-full"
            />
          </div>
          <div className="flex flex-col gap-y-6 text-center text-lg  tracking-tighter sm:text-justify lg:w-1/2">
            <h2 className="mt-6 font-medium tracking-wide">2. Sale Deals</h2>
            <p className="mt-2">
              Certain &quot;Sale&quot; offers don&apos;t need a code for the
              discount. You&apos;ll notice these by the &quot;Get Deal&quot;
              button, allowing you to access the discount directly without
              entering a code during your purchase.
            </p>
          </div>
        </div>
      </div>

      {/* Need To Know Div */}
      <div className="w-full rounded-lg  p-10 text-lg">
        <h1 className="text-center font-bold sm:text-xl lg:text-start">
          You need To know this
        </h1>
        <p className="mt-6 text-center lg:text-start">
          We assure you that if a code doesn&apos;t work, we&apos;ll provide you
          with a gift card. Because as we have already said, customer
          satisfaction is our top priority. Before contacting us, please ensure
          you&apos;ve reviewed all the terms and conditions. Here are a few
          important ones to consider:
        </p>
        <ul className="ml-6 mt-6 flex list-disc flex-col gap-4">
          <li>
            The coupon code you&apos;re trying to use must be an online code,
            specifically one that you input during the purchase process.
          </li>
          <li>
            We will provide gift cards only for invalid codes only. However, if
            upon verification process, the codes are found valid, we&apos;ll
            ensure to provide a screenshot as proof.
          </li>
          <li>
            You want to purchase using our coupon code and if the coupon code
            doesn&apos;t work and you made a purchase then you&apos;re eligible
            to receive a gift card under our “Our Codes” guarantee.{" "}
            <span className="font-bold">
              NOTE:- You have to complete the purchase without any other codes!
            </span>
          </li>
          <li>
            To redeem the coupon code, it&apos;s crucial that you&apos;ve
            ordered a product eligible for the discount. Reviewing all terms and
            conditions is extremely important to ensure your product aligns with
            all requirements for the code.
          </li>
          <li>
            Our Codes guarantee Gift Card Limit is set to $10 maximum per day
            and maximum of 5 claims per year for per person.
          </li>
          <li>
            To receive a successful claim you must include a screenshot of your
            successful purchase without any other coupon code.
          </li>
          <li>
            All claims should be sent to the following e-mail address:
            <span className="font-bold text-sky-500">
              <Link
                href={"mailto:claims@qwiksavings.com"}
                className="break-words"
              >
                claims@qwiksavings.com
              </Link>
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default OurCodesPage;
