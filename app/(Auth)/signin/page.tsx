import Link from "next/link";
import SignInForm from "../_components/SignInForm";
import { Metadata } from "next";

// Metadata for the page
export const metadata: Metadata = {
  title: "Sign in",
  description: "Signin page for Qwik Saving",
};

const SignInPage = () => {
  return (
    <article className="flex flex-col items-center gap-4">
      <h1 className="text-4xl md:text-5xl">Signin</h1>
      <p className="text-sm">
        Are you new here?{" "}
        <span className="cursor-pointer text-app-main underline">
          <Link href={"/signup"}>SignUp</Link>
        </span>
      </p>
      {/* Form container div */}
      <div className="flex w-11/12 flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar sm:w-full ">
        <SignInForm />
        {/* Terms and conditions statement */}
        <p className="mx-auto mt-4 text-center text-xs font-semibold">
          By continuing, I agree to Qwik Saving’s{" "}
          <span className="cursor-pointer text-sm font-bold underline">
            <Link href={"/"}>Privacy Policy</Link>
          </span>{" "}
          and{" "}
          <span className="cursor-pointer text-sm font-bold underline">
            <Link href={"/"}>Terms of Use</Link>
          </span>
        </p>
      </div>
    </article>
  );
};

export default SignInPage;
