import IntroSection from "./_components/Sections/IntroSection";

export default async function Home() {
  return (
    // mainHomePage
    <main className="flex w-full flex-col items-center pt-32 lg:pt-44">
      {/* Intro Section*/}
      <IntroSection />
    </main>
  );
}
