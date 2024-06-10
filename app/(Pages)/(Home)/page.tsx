import CategoriesSection from "./_components/Sections/CategoriesSection";
import FeaturedStoreSection from "./_components/Sections/FeaturedStoreSection";
import IntroSection from "./_components/Sections/IntroSection";

export default async function Home() {
  return (
    // mainHomePage
    <>
      {/* Intro Section*/}
      <IntroSection />
      <FeaturedStoreSection />
      <CategoriesSection title="Clothing Offers" fetchFrom="Clothings" />
      {/*TODO: Static content */}
      <CategoriesSection title="Travel Offers" fetchFrom="Travels" />
      <CategoriesSection title="Elelctronic Offers" fetchFrom="Electronics" />
      <CategoriesSection
        title="Home Garden Offers"
        fetchFrom="Home and Garden"
      />
      <CategoriesSection title="Beauty Offer" fetchFrom="Beauty" />
      <CategoriesSection
        title="Accessories Offers"
        fetchFrom="Food and Beverages"
      />
      {/*TODO: Static content */}
    </>
  );
}
