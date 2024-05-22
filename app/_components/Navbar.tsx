import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search } from "lucide-react";
import AuthButtons from "./AuthButtons";

const Navbar = () => {
  return (
    <nav className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-b-app-main bg-white p-4 px-2  dark:bg-app-dark-navbar md:px-6 lg:h-20 lg:px-20">
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

      {/* TODO: ADD NAVLINKS*/}

      <div className="flex items-center gap-x-1 sm:gap-x-4">
        {/* Search bar */}
        <div className="flex w-56 items-center justify-between rounded-full border-2 border-app-main p-2 sm:px-3 md:w-64">
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
        {/* SignIn/SignOut and Signup Buttons */}
        <AuthButtons />
        <ThemeSwitcher />
        <Menu className="size-6 dark:text-slate-200 lg:hidden" />
      </div>
    </nav>
  );
};

export default Navbar;
