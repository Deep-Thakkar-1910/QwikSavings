import AboutUs from "./_components/Sections/AboutUs";
import CategoriesSection from "./_components/Sections/CategoriesSection";
import FeaturedStoreSection from "./_components/Sections/FeaturedStoreSection";
import HowToUse from "./_components/Sections/HowToUse";
import IntroSection from "./_components/Sections/IntroSection";

export default async function Home() {
  return (
    // mainHomePage
    <>
      {/* Intro Section*/}
      <IntroSection />
      <FeaturedStoreSection />
      <CategoriesSection title="Clothing Offers" fetchFrom="Clothings" />
      <CategoriesSection
        title="Health and Fitness"
        fetchFrom="Health & Fitness Offers"
      />
      {/* How to use Qwik Savings section */}
      <HowToUse />
      <CategoriesSection title="Travel Offers" fetchFrom="Travels" />
      <CategoriesSection title="Elelctronic Offers" fetchFrom="Electronics" />
      <CategoriesSection
        title="Home Garden Offers"
        fetchFrom="Home and Garden"
      />
      <CategoriesSection title="Beauty Offer" fetchFrom="Beauty" />
      <CategoriesSection title="Food Offers" fetchFrom="Food" />
      <AboutUs />
    </>
  );
}
