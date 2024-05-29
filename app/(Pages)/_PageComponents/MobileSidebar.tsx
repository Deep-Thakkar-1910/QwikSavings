"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet";
import { useMobileSidebar } from "@/hooks/useMobileSidebar";
import { NavLinks } from "@/lib/utilities/Navlinks";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import AuthButtons from "./AuthButtons";
import ProfileDropDown from "./ProfileDropDown";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const MobileSidebar = () => {
  // extracting the pathname to observer route changes
  const pathname = usePathname();
  // sidebar states
  const onOpen = useMobileSidebar((state) => state.onOpen);
  const onClose = useMobileSidebar((state) => state.onClose);
  const isOpen = useMobileSidebar((state) => state.isOpen);

  useEffect(() => {
    // will manually close the sidebar once the route changes and display acitve links
    onClose();
  }, [pathname, onClose]);

  return (
    <aside>
      <Menu className="size-6" onClick={onOpen} />

      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="flex w-10/12 flex-col items-center border-l  bg-white dark:bg-app-dark-navbar sm:w-2/3 md:w-2/5 lg:hidden"
        >
          <SheetHeader>
            <ProfileDropDown />
          </SheetHeader>
          <div className="before: after: mx-auto mb-4 flex w-full items-center justify-center before:block before:h-px before:flex-grow before:bg-gray-500 after:block after:h-px after:flex-grow after:bg-gray-500"></div>
          <div className="mb-20">
            <ul role="tablist" className="flex flex-col items-center gap-y-4">
              {NavLinks.map((link, index) => {
                return (
                  <li key={index} role="tab">
                    <Link href={link.href}>
                      <button
                        className={cn(
                          "text-2xl font-medium",
                          pathname === link.href && "text-app-main",
                        )}
                      >
                        {link.title}
                      </button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <SheetFooter>
            <Image
              alt="Logo"
              src={"/Logos/FooterLogo.png"}
              width={1920}
              height={1080}
            />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </aside>
  );
};

export default MobileSidebar;
