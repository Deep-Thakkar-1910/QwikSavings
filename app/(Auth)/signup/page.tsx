import Link from "next/link";
import SignUpForm from "../_components/SignUpForm";
import { Metadata } from "next";

// Metadata for the page
export const metadata: Metadata = {
  title: "Sign up",
  description: "Signin page for Qwik Saving",
};
const SignUpPage = () => {
  return (
    <article className="flex flex-col items-center gap-4 pt-20">
      <h1 className="text-4xl md:text-5xl">Join Now</h1>
      <p className="text-sm">
        Already have an account?{" "}
        <span className="cursor-pointer text-app-main underline">
          <Link href={"/signin"}>SignIn</Link>
        </span>
      </p>
      {/* Form container div */}
      <div className="flex w-11/12 flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar sm:w-full ">
        <SignUpForm />
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

export default SignUpPage;
