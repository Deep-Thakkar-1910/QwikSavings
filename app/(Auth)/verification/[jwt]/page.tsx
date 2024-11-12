import { Button } from "@/components/ui/button";
import { verifyUser } from "@/lib/Actions/AuthActions";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verify",
  description: "Verify your email",
};

const VerificationPage = async ({ params }: { params: { jwt: string } }) => {
  const result = await verifyUser(params.jwt);
  return (
    <article className="flex size-full flex-col place-items-center gap-4">
      {result === "success" ? (
        <p className="text-2xl">Verfication Successful</p>
      ) : result === "userDoesNotExist" ? (
        <p className="text-2xl text-red-600">User does not exist</p>
      ) : result === "userAlreadyVerified" ? (
        <p className="text-2xl text-red-600">You are already verified</p>
      ) : (
        <p className="text-2xl text-red-600">
          OOPS! Something went wrong Please try later
        </p>
      )}
      <Button asChild className="bg-app-main font-semibold">
        <Link href={"/signin"}>Sign In into your account</Link>
      </Button>
    </article>
  );
};

export default VerificationPage;
