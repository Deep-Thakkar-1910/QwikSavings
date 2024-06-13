"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AuthButtons = () => {
  const { data: session } = useSession();
  return (
    <div className="flex gap-x-4">
      {!session?.user && (
        <>
          <Button
            variant={"outline"}
            asChild
            size={"default"}
            className="cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1 hover:text-app-main lg:block"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button
            asChild
            size={"default"}
            className="cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1 lg:block"
          >
            <Link href="/signin">Sign In</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
