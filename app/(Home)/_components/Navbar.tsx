import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { NavLinks } from "@/lib/utilities/Navlinks";
import MobileSidebar from "./MobileSidebar";
import ProfileDropDown from "./ProfileDropDown";

const Navbar = () => {
  return (
    <nav className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-b-app-main bg-white p-4 px-2  dark:bg-app-dark-navbar md:px-6 lg:h-20 lg:px-8">
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

      <ul className="hidden items-center gap-x-5 lg:flex" role="tablist">
        {NavLinks.map((link, index) => {
          return (
            <li key={index} role="tab">
              <Link href={link.href}>
                <button className="font-medium transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-b-2 hover:border-b-app-main hover:text-app-main">
                  {link.title}
                </button>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-x-2 sm:gap-x-3">
        <div className="hidden lg:block">
          <ProfileDropDown />
        </div>
        {/* Search bar */}
        <div className="flex w-56 items-center justify-between rounded-full border-2 border-app-main p-1 sm:w-64 sm:px-3 sm:py-2">
          <label htmlFor="search">
            <Search className=" mr-2 size-6 text-app-main" />
          </label>
          <input
            id="search"
            type="text"
            className="w-full border-none bg-transparent caret-rose-600 outline-none placeholder:text-xs md:placeholder:text-sm"
            placeholder="Search for brands, categories"
          />
        </div>
        <div className="lg:hidden">
          <MobileSidebar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
