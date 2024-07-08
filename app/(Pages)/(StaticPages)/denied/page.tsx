import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <div className="mb-6 flex size-full min-h-[70vh]  flex-col items-center justify-center gap-y-4">
      <h1 className="text-2xl font-semibold">Denied Access</h1>
      <p>Please login with an admin account to access this page</p>
      <Button asChild size={"lg"}>
        <Link href={"/signin"}>Sign In</Link>
      </Button>
    </div>
  );
};

export default page;
