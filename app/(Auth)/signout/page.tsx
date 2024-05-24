"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/* 
this page will never be displayed it is just a workaround to signout the user
using the signout function from next-auth
*/
const SignOutPage = () => {
  const router = useRouter();
  useEffect(() => {
    signOut({ callbackUrl: "/", redirect: false });
    router.push("/");
  }, [router]);
  return null;
};

export default SignOutPage;
