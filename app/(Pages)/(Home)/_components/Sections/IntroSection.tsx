import { CardFlipperData } from "@/lib/utilities/CardFlipperData";
import { ImageCarouselData } from "@/lib/utilities/ImageCarouselData";
import ImageCarousel from "../ImageCarousel";
import CardStackFlipper from "../CardStackFlipper";

const IntroSection = () => {
  return (
    <section className="flex w-full  flex-col items-center" id="Intro">
      {/* Image slider and flipper div */}
      <div className="mb-10 flex max-w-screen-xl items-start px-8 md:w-4/5 lg:mb-14 lg:gap-x-16 lg:px-16 xl:mb-10  xl:gap-x-20">
        <ImageCarousel data={ImageCarouselData} />
        <CardStackFlipper data={CardFlipperData} autoplay />
      </div>
      {/* Intro heading div */}
      <div className="flex w-full flex-col items-center justify-center bg-white p-8 dark:bg-popover lg:px-16">
        <h1 className="mx-auto mb-6 text-center text-lg font-bold md:text-xl xl:text-2xl">
          Qwik Savings - Your one stop shop for quick savings.
        </h1>
        <div className="flex max-w-screen-xl flex-col justify-evenly gap-6 font-medium lg:flex-row">
          <p className="basis-[45%] text-justify">
            Escape the chaos of crowded malls and endless parking quests! Qwik
            Savings is your digital haven, offering steep discounts on
            everything you desire, all from the comfort of your couch. By
            offering verified, double-checked coupon codes l and offers for over
            5,000+ brands on our portal, we are the front line leaders of online
            coupons in the USA and beyond.
          </p>

          <p className="basis-[45%] text-justify">
            {`
            Whatever your heart desires, we aim to have it all. Our dedicated
            code expert team is always on the hunt for the perfect coupons so
            that you can enjoy great savings without even wasting a time. Simply
            visit our portal, explore our diverse range of brands, and place
            your trust in us-rest assured, disappointment isn't in our
            dictionary.`}
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
