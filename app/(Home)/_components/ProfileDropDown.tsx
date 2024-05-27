"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Moon,
  Sun,
  UserPlusIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
const ProfileDropDown = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();

  //   return the dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-0">
        <Avatar>
          <AvatarImage src={session?.user?.image!} />
          <AvatarFallback>{session?.user?.name ?? "QS"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session?.user?.email && (
          <DropdownMenuItem className="text-sky-700 dark:text-sky-500">
            {session?.user?.email}
          </DropdownMenuItem>
        )}
        {!session && (
          <>
            <Link href={"signup"}>
              <DropdownMenuItem>
                <UserPlusIcon className="mr-2 size-4" />
                <span>Sign up</span>
              </DropdownMenuItem>
            </Link>
            <Link href={"/signin"}>
              <DropdownMenuItem>
                <ArrowRightFromLine className="mr-2 size-4" />
                <span>Sign In</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}
        <DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuSubTrigger>
            {resolvedTheme === "dark" ? (
              <Moon className="mr-2 size-4" />
            ) : (
              <Sun className="mr-2 size-4" />
            )}
            <span>Theme</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
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

        {session?.user && (
          <>
            <DropdownMenuSeparator />
            <Link href={"/api/auth/signout"}>
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
