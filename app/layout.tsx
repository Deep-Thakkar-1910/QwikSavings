import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./(Pages)/_PageComponents/Navbar";
import Providers from "./Providers";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./(Pages)/_PageComponents/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | QwikSavings",
    default: "QwikSavings",
  },
  description: "Generated by create next app",
  icons: "/Logos/favicon.png",
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
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
