import ImageCarousel from "../ImageCarousel";
import CardStackFlipper from "../CardStackFlipper";

const IntroSection = async () => {
  return (
    <section className="flex w-full flex-col items-center" id="Intro">
      {/* Image slider and flipper div */}
      <div className="mb-10 flex min-h-[40vh] max-w-screen-xl items-start px-8 lg:mb-14 lg:gap-x-6 lg:px-16 xl:px-10 2xl:gap-x-0 ">
        <ImageCarousel />
        <CardStackFlipper autoplay />
      </div>
      {/* Intro heading div */}
      <div className="flex w-full flex-col items-center justify-center bg-popover p-10 ">
        <h1 className="mx-auto mb-6 px-4 text-center text-lg font-bold sm:px-8 md:text-xl lg:px-16 xl:px-2 xl:text-2xl 2xl:px-0">
          Qwik Savings - Your one stop shop for quick savings.
        </h1>
        <div className="flex max-w-screen-xl flex-col justify-between gap-6 font-medium lg:flex-row">
          <p className="basis-1/2 text-justify">
            Escape the chaos of crowded malls and endless parking quests! Qwik
            Savings is your digital haven, offering steep discounts on
            everything you desire, all from the comfort of your couch. By
            offering verified, double-checked coupon codes l and offers for over
            5,000+ brands on our portal, we are the front line leaders of online
            coupons in the USA and beyond.
          </p>

          <p className="basis-1/2 text-justify">
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
