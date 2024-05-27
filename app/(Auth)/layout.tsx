import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section
      className="flex min-h-screen w-full
     items-center justify-center"
    >
      {children}
    </section>
  );
};

export default AuthLayout;
