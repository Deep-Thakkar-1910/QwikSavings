"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeftFromLine, Heart, Moon, Sun, UserCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

const ProfileDropDown = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();
  const currentUrl = usePathname();
  // extracting first name and last name initals from the user name
  const name = session?.user?.name.split(" ");
  const AvatarName =
    name && name.length > 1
      ? name[0][0]?.toUpperCase() + name[1][0]?.toUpperCase()
      : name && name[0][0]?.toUpperCase();
  //   return the dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`rounded-full outline-0 ${session?.user ? "" : "lg:hidden"}`}
      >
        <Avatar>
          <AvatarImage src={session?.user?.image!} />
          <AvatarFallback>
            {AvatarName ?? <UserCircle2 className="size-full" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-center">Profile</DropdownMenuLabel>
        <DropdownMenuSeparator className={`${session?.user ? "" : "hidden"}`} />
        {session?.user?.email && (
          <DropdownMenuItem className="overflow-x-auto text-sky-700 dark:text-sky-500">
            <p className="text-balance">{session?.user?.email}</p>
          </DropdownMenuItem>
        )}
        <DropdownMenuGroup>
          <DropdownMenuSeparator className="sm:hidden" />
          <DropdownMenuLabel className="sm:hidden">Theme</DropdownMenuLabel>
          <DropdownMenuSeparator className="hidden sm:block" />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hidden sm:flex">
              {resolvedTheme === "dark" ? (
                <Moon className="mr-2 size-4" />
              ) : (
                <Sun className="mr-2 size-4" />
              )}
              <span>Theme</span>
            </DropdownMenuSubTrigger>

            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="sm:hidden"
            >
              <Sun className="mr-2 size-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="sm:hidden"
            >
              <Moon className="mr-2 size-4" />
              <span>Dark</span>
            </DropdownMenuItem>

            <DropdownMenuSubContent className="hidden sm:block">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 size-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 size-4" />
                <span>Dark</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        {session?.user && (
          <>
            <DropdownMenuSeparator />
            <Link href="/bookmarks">
              <DropdownMenuItem>
                <Heart className="mr-2 size-4" />
                <span>My Bookmarks</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={`/api/auth/signout?callbackUrl=${currentUrl}`}>
              <DropdownMenuItem>
                <ArrowLeftFromLine className="mr-2 size-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropDown;
