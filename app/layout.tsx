import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./(Pages)/_PageComponents/Navbar";
import Providers from "./Providers";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./(Pages)/_PageComponents/Footer";
import AdminNavbar from "./(Pages)/(ADMIN)/_Admincomponents/AdminNavbar";
import ScrollToTop from "./(Pages)/_PageComponents/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://qwiksavings.com"),
  title: {
    template: "%s | QwikSavings",
    default: "QwikSavings",
  },
  description: "Qwik Savings - Your one stop shop for quick savings.",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-app-bg-main text-black dark:bg-app-dark dark:text-slate-200`}
      >
        <Providers>
          <AdminNavbar />
          <Navbar />
          {children}
          <ScrollToTop />
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
