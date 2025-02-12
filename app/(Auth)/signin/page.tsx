import { Metadata } from "next";
import Link from "next/link";
import SignInForm from "../_components/SignInForm";

// Metadata for the page
export const metadata: Metadata = {
  title: "Login",
  description: "Login page for Qwik Saving",
};

const SignInPage = ({
  searchParams,
}: {
  searchParams: Record<string, any>;
}) => {
  return (
    <article className="flex flex-col items-right gap-4">
      <h1 className="text-4xl md:text-5xl">Login</h1>
      <p className="text-sm">
        Are you new here?{" "}
        <span className="cursor-pointer text-app-main underline">
          <Link href={"/signup"}>SignUp</Link>
        </span>
      </p>
      {/* Form container div */}
      <div className="flex w-11/12 flex-col items-center justify-center rounded-lg border-2 bg-white p-6 sm:w-full ">
        <SignInForm callbackUrl={searchParams.callbackUrl} />
        {/* Terms and conditions statement */}
        <p className="mx-auto mt-4 text-center text-xs font-semibold">
          By continuing, I agree to Qwik Saving&apos;s{" "}
          <span className="cursor-pointer text-sm font-bold underline">
            <Link href={"/privacypolicy"}>Privacy Policy</Link>
          </span>{" "}
          and{" "}
          <span className="cursor-pointer text-sm font-bold underline">
            <Link href={"/termsofservice"}>Terms of Service</Link>
          </span>
        </p>
      </div>
    </article>
  );
};

export default SignInPage;
