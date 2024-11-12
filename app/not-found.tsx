import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex size-full h-[70vh] flex-col items-center justify-center gap-y-4">
      <h1 className="text-3xl">404 - Page Not Found</h1>
      <Button asChild className="bg-app-main">
        <Link href={"/"}>Return To Homepage</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
