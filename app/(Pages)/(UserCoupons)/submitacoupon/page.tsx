"use client";
import Link from "next/link";
import CreateUserCouponForm from "../_userCouponComponents/SubmitACouponForm";
import { useActiveFestival } from "@/hooks/useFestivalActive";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const CreateUserCoupon = () => {
  const isActiveFestival = useActiveFestival((state) => state.isActive);
  return (
    <div
      className={`mx-auto my-6 w-11/12  max-w-2xl rounded-md bg-popover p-6 ${isActiveFestival ? "!mb-14" : ""}`}
    >
      <div className="mb-4 rounded bg-app-main py-3 text-center text-slate-200">
        <h2 className="text-xl font-bold">
          Submit A Coupon & Help Millions Save!
        </h2>
      </div>

      <p className="mb-6 text-center text-sm text-muted-foreground">
        To submit a coupon, simply fill out our form below. Our team will
        carefully review and approve it before sharing it with the public. Thank
        you for your commitment to helping everyone save money!
      </p>

      <div className="mx-auto max-w-xl rounded-md border p-4">
        <CreateUserCouponForm />
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Please only submit publicly available coupon codes and not private or
        internal company codes. When in doubt, please obtain permission from the
        merchant first. See our{" "}
        <Link href={"/termsandconditions"} className="text-sky-500">
          Terms and Conditions
        </Link>{" "}
        for more information regarding user-generated content. Thank you very
        much!
      </p>
    </div>
  );
};

export default CreateUserCoupon;
