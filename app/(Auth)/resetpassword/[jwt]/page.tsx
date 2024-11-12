import { Metadata } from "next";
import ResetPasswordForm from "../../_components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password",
};

const ResetPasswordPage = ({ params }: { params: { jwt: string } }) => {
  return (
    <article className="flex flex-col items-center gap-4">
      <h1 className="text-4xl md:text-5xl">Reset Your Password</h1>
      {/* Form container div */}
      <div className="flex w-11/12 flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar sm:w-full ">
        <ResetPasswordForm jwtUserId={params.jwt} />
      </div>
    </article>
  );
};

export default ResetPasswordPage;
