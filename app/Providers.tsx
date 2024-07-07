"use client";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        {...props}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
