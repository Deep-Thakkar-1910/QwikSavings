"use client";
import { ReactNode } from "react";
import BreadCrumbNavigation from "./_PageComponents/BreadCrumbNavigation";
import { useActiveFestival } from "@/hooks/useFestivalActive";
import { useSession } from "next-auth/react";

const PagesLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const isActiveFestival = useActiveFestival((state) => state.isActive);
  const isAdmin = session?.user?.role === "admin";
  return (
    <main className="w-full pt-16 lg:pt-20">
      {/* for Easy navigation and keeping track of current path */}
      <BreadCrumbNavigation />
      <div
        className={`${isActiveFestival && !isAdmin ? "mb-4 translate-y-8 transition-transform duration-200 ease-linear" : "mb-0 translate-y-0 transition-transform duration-200 ease-linear"}`}
      >
        {children}
      </div>
    </main>
  );
};

export default PagesLayout;
