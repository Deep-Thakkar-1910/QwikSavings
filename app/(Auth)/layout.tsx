import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section
      className="flex min-h-screen w-full
     items-center justify-center bg-slate-100 dark:bg-app-dark"
    >
      {children}
    </section>
  );
};

export default AuthLayout;
