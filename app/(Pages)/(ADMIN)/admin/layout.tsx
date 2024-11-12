import { Metadata } from "next";
import { ReactNode } from "react";
export const metadata: Metadata = {
  title: "Admin",
};
const AdminLayout = ({ children }: { children: ReactNode }) => <>{children}</>;

export default AdminLayout;
