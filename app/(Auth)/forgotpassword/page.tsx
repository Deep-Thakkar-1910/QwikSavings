import ForgotPasswordForm from "../_components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <article className="flex flex-col items-center gap-4">
      <h1 className="text-4xl md:text-5xl">Forgot Password?</h1>
      <p className="text-base">Enter Your Registered E-mail</p>
      {/* Form container div */}
      <div className="flex w-11/12 flex-col items-center justify-center rounded-lg border-2 bg-white p-6 sm:w-full ">
        <ForgotPasswordForm />
      </div>
    </article>
  );
};

export default ForgotPasswordPage;
