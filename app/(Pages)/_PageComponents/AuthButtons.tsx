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
            className="cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1 hover:text-app-main"
          >
            <Link href="/signin">Login</Link>
          </Button>
          <Button
            asChild
            className="cursor-pointer bg-app-main transition-transform duration-200 ease-out hover:-translate-y-1 hover:bg-app-main"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
