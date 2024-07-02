import Link from "next/link";
import { ReactNode } from "react";
const AdminDisplayLayout = ({ children }: { children: ReactNode }) => {
  const adminNavlinks = [
    { href: "/admin/", title: "All Stores" },
    { href: "/admin/categories", title: "All Categories" },
    { href: "/admin/coupons", title: "All Coupons" },
    { href: "admin/events", title: "All Events" },
    { href: "admin/blogs", title: "All Blogs" },
  ];

  return (
    <section className="flex w-full flex-col items-center">
      <h1 className="text-center text-3xl font-semibold sm:text-4xl">
        Welcome To The Admin Panel Of
      </h1>
      <p className="mt-4 rounded-md bg-gradient-to-r from-pink-700 to-app-main p-2 text-2xl font-bold text-white sm:p-4 sm:text-3xl">
        QWIK SAVINGS
      </p>

      <ul
        className="mt-6 flex flex-wrap items-center justify-center gap-4"
        role="tablist"
      >
        {adminNavlinks.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="grid min-w-28 place-items-center rounded-md border border-app-main p-2 shadow-md transition-transform duration-300 ease-linear hover:-translate-y-1"
            >
              <button
                className={`transition-all duration-200 ease-linear hover:text-app-main`}
              >
                {link.title}
              </button>
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
};

export default AdminDisplayLayout;
