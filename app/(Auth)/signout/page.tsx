"use client";

import { toast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/* 
this page will never be displayed it is just a workaround to signout the user
using the signout function from next-auth
*/
const SignOutPage = ({
  searchParams,
}: {
  searchParams: { callbackUrl: string };
}) => {
  const router = useRouter();

  useEffect(() => {
    signOut({ redirect: false, callbackUrl: searchParams.callbackUrl ?? "/" });
    toast({
      title: "Success",
      description: "You have been signed out",
    });
    router.push("/");
  }, [router]);
  return null;
};

export default SignOutPage;
