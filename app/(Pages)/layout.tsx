import { ReactNode } from "react";
import BreadCrumbNavigation from "./_PageComponents/BreadCrumbNavigation";

const PagesLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full pt-24 lg:pt-28">
      {/* for Easy navigation and keeping track of current path */}
      <BreadCrumbNavigation />
      {children}
    </main>
  );
};

export default PagesLayout;
