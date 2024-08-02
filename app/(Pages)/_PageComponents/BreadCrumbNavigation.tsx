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
import { Home, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const BreadCrumbNavigation = () => {
  // getting all the url paths and converting them to array
  const paths = usePathname().split("/").slice(1);

  const decodedPaths = paths.map((path) => decodeURIComponent(path));

  return (
    <Breadcrumb className="my-4 place-self-start px-8 lg:px-12">
      <BreadcrumbList className="flex gap-0 text-xs text-black dark:text-slate-200 sm:text-sm lg:text-base">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            {decodedPaths[0] && <Home />}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {/* Show initial seperator only if not on homepage */}
        {decodedPaths[0] && (
          <BreadcrumbSeparator>
            <ChevronRight className="size-4 sm:size-6 lg:size-8" />
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
                  {Number.isInteger(Number(path))
                    ? decodedPaths[0]?.substring(
                        0,
                        decodedPaths[0]?.length - 1,
                      ) ?? ""
                    : path}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < decodedPaths.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="size-4 sm:size-6 lg:size-8" />
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
