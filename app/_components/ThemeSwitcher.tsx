"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Moon, Sun } from "lucide-react";
const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  // to avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  // to Load switcher while base theme is being resolved
  if (!mounted) return <Skeleton className="hidden size-6 lg:block" />;

  // to render the switcher based on the resolved theme
  if (resolvedTheme === "dark") {
    return (
      <Sun
        onClick={() => setTheme("light")}
        className="hidden size-6 fill-slate-200 stroke-slate-200 lg:block"
      />
    );
  }

  if (resolvedTheme === "light") {
    return (
      <Moon
        onClick={() => setTheme("dark")}
        className="hidden size-6 lg:block"
      />
    );
  }
};
export default ThemeSwitcher;
