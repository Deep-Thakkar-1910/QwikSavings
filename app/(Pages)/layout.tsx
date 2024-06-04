import { ReactNode } from "react";
import BreadCrumbNavigation from "./_PageComponents/BreadCrumbNavigation";
import AdminNavbar from "./(ADMIN)/_Admincomponents/AdminNavbar";

const PagesLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full pt-16 lg:pt-20">
      {/* for admin's ease of access */}
      <AdminNavbar />
      {/* for Easy navigation and keeping track of current path */}
      <BreadCrumbNavigation />
      {children}
    </main>
  );
};

export default PagesLayout;
