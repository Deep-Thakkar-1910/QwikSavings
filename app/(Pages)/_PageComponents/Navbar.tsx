"use client";
import Link from "next/link";
import Image from "next/image";
import { NavLinks } from "@/lib/utilities/Navlinks";
import MobileSidebar from "./MobileSidebar";
import ProfileDropDown from "./ProfileDropDown";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import AuthButtons from "./AuthButtons";
import { useSession } from "next-auth/react";
import SearchBar from "./SearchBar";
import FestivalStrip from "./Festival";
import { useActiveFestival } from "@/hooks/useFestivalActive";
const Navbar = () => {
  const pathname = usePathname();
  const paths = pathname.split("/");
  const isCurrent = (href: string): boolean => {
    // checking if current pathname has the current link
    // if yes return true for coloring the active link else return false
    if (paths.includes(href)) return true;
    return false;
  };
  const { data: session } = useSession();
  const isActive = useActiveFestival((state) => state.isActive);
  return (
    <header
      className={cn(
        "fixed left-0 top-0 z-50 w-full -translate-y-16 transition-transform duration-200 ease-linear",
        isActive &&
          "translate-y-0 transition-transform duration-200 ease-linear",
      )}
    >
      <FestivalStrip />
      <nav className="flex h-16 w-full items-center justify-between border-b border-b-app-main bg-white p-4 px-2  dark:bg-app-dark-navbar sm:px-4 md:px-6 lg:h-20 xl:px-12 ">
        {/* Branding */}
        <Link href={"/"}>
          <Image
            src={"/Logos/logo.png"}
            alt="Logo"
            width={500}
            height={500}
            className="hidden h-20 w-60 lg:inline-block"
          />
          <Image
            src={"/Logos/favicon.png"}
            alt="Logo"
            width={200}
            height={200}
            className="size-8 sm:size-12 md:size-14 lg:hidden"
          />
        </Link>

        <ul
          className="hidden items-center gap-x-3 lg:flex xl:gap-x-5"
          role="tablist"
        >
          {session?.user.role === "admin" && (
            <li role="tab">
              <Link href={"/admin"}>
                <button
                  className={cn(
                    "text-sm font-medium transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-b-2 hover:border-b-app-main hover:text-app-main xl:text-base",
                    isCurrent("admin") && "text-app-main",
                  )}
                >
                  Admin
                </button>
              </Link>
            </li>
          )}
          {NavLinks.map((link, index) => {
            return (
              <li key={index} role="tab">
                <Link href={link.href}>
                  <button
                    className={cn(
                      "text-sm font-medium transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-b-2 hover:border-b-app-main hover:text-app-main xl:text-base",
                      isCurrent(link.href.slice(1)) && "text-app-main",
                    )}
                  >
                    {link.title}
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-x-2 sm:gap-x-3">
          {/* Search bar */}
          <SearchBar />
          <div className="lg:hidden">
            <MobileSidebar />
          </div>
          <div className="hidden items-center gap-x-4 lg:flex">
            <AuthButtons />
            <ProfileDropDown />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
