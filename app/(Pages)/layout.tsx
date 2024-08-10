"use client";
import { ReactNode } from "react";
import BreadCrumbNavigation from "./_PageComponents/BreadCrumbNavigation";
import { useActiveFestival } from "@/hooks/useFestivalActive";

const PagesLayout = ({ children }: { children: ReactNode }) => {
  const isActiveFestival = useActiveFestival((state) => state.isActive);
  return (
    <main className="w-full pt-16 lg:pt-20">
      {/* for Easy navigation and keeping track of current path */}
      <BreadCrumbNavigation />
      <div
        className={`${isActiveFestival ? "mb-4 translate-y-8 transition-transform duration-200 ease-linear" : "mb-0 translate-y-0 transition-transform duration-200 ease-linear"}`}
      >
        {children}
      </div>
    </main>
  );
};

export default PagesLayout;
