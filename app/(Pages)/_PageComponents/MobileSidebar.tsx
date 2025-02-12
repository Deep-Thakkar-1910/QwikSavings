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
import Link from "next/link";
// import AuthButtons from "./AuthButtons";
import ProfileDropDown from "./ProfileDropDown";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import AuthButtons from "./AuthButtons";
import Seperator from "./Seperator";
import { useSession } from "next-auth/react";

const MobileSidebar = () => {
  // extracting the pathname to observer route changes
  const pathname = usePathname();
  const paths = pathname.split("/");
  const { data: session } = useSession();
  const isCurrent = (href: string): boolean => {
    if (paths.includes(href)) return true;
    return false;
  };
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
          className="flex w-10/12 flex-col items-center justify-around border-l bg-white sm:w-2/3 md:w-2/5 lg:hidden"
        >
          <SheetHeader className="w-full ">
            <div className="mx-auto">
              <ProfileDropDown />
            </div>
            <Seperator />
          </SheetHeader>
          <div className="mb-20">
            <ul role="tablist" className="flex flex-col items-center gap-y-4 ">
              {session?.user.role === "admin" && (
                <li role="tab">
                  <Link href={"/admin"}>
                    <button
                      className={cn(
                        "text-2xl font-medium",
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
                          "text-2xl font-medium",
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
          </div>
          <SheetFooter>
            <AuthButtons />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </aside>
  );
};

export default MobileSidebar;
