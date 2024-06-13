"use client";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Home, Slash } from "lucide-react";
import { usePathname } from "next/navigation";

const BreadCrumbNavigation = () => {
  // getting all the url paths and converting them to array
  const paths = usePathname().split("/").slice(1);

  const decodedPaths = paths.map((path) => decodeURIComponent(path));

  return (
    <Breadcrumb className="my-4 place-self-start px-8  lg:px-16">
      <BreadcrumbList className="text-black dark:text-slate-200">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {/* Show initial seperator only if not on homepage */}
        {decodedPaths[0] && (
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
        )}
        {decodedPaths.map((path, index) => {
          const href = "/" + decodedPaths.slice(0, index + 1).join("/");
          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={href}
                  className={cn(
                    "font-semibold first-letter:uppercase",
                    index === decodedPaths.length - 1 && "text-app-main",
                  )}
                >
                  {path}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < decodedPaths.length - 1 && (
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbNavigation;
