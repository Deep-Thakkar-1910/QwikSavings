import { HowToUseData } from "@/lib/utilities/HowToUse";
import Image from "next/image";
const HowToUse = () => {
  return (
    <section className={`my-12 flex flex-col bg-popover py-6`}>
      <div className="mx-auto flex max-w-screen-xl flex-col items-center sm:px-10 md:items-start lg:px-12 xl:px-6 2xl:px-0">
        <h2 className="mb-4 text-center text-xl font-bold sm:text-2xl lg:text-3xl">
          How to use Qwik Savings
        </h2>
        <div className="grid w-full grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 ">
          {HowToUseData.map((howToUseItem) => {
            return (
              <div
                key={howToUseItem.id}
                className="flex h-96 w-full max-w-72 flex-col items-center justify-center gap-y-4 rounded-xl bg-app-bg-main p-4 shadow-md dark:bg-background sm:max-w-96 md:max-w-full  md:last:col-span-2 lg:last:col-span-1"
              >
                <Image
                  src={howToUseItem.image}
                  alt={`Instruction Image ${howToUseItem.id}`}
                  width={3464}
                  height={3464}
                  loading="eager"
                  className="aspect-square size-40 object-contain"
                />
                <h3 className="text-xl font-semibold sm:text-2xl">
                  <span className="font-bold tabular-nums ">
                    {howToUseItem.id + "."}
                  </span>
                  {howToUseItem.heading}
                </h3>
                <p className="mx-auto text-center text-base font-medium">
                  {howToUseItem.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
