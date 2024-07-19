"use client";

import { Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryFilterForBlogs from "../../../_Admincomponents/CategoryFilterForBlogs";
import useGetBlogsByCategory from "@/hooks/useGetBlogsByCategory";
import BlogsDisplay from "../../../_Admincomponents/BlogsDisplay";
import axios from "@/app/api/axios/axios";

const AllBlogsPage = () => {
  const [categories, setCategories] = useState<
    { categoryId: number; name: string }[]
  >([]);
  const { data, error, isLoading, like, setLike, totalCount } =
    useGetBlogsByCategory();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/getcategories");
        if (response.data?.success) {
          setCategories(response.data.categories);
          setLike(response.data.categories[0].name);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, [setLike]);
  return (
    <section className="mt-10 flex w-full flex-col items-center">
      <h1 className="mb-6 text-2xl font-bold">Blogs</h1>
      <CategoryFilterForBlogs
        like={like}
        setLike={setLike}
        categories={categories}
      />
      <div className="my-6 flex w-full flex-col items-center justify-between px-4 sm:flex-row sm:px-8 lg:px-16">
        <Link
          href={"/admin/createblog"}
          className="flex items-center gap-x-1 text-app-main underline transition-transform duration-200 ease-linear hover:scale-105"
        >
          <Tag className="size-3" />
          Create a new Blog
        </Link>
        <span className="text-xl font-medium">
          Total Blogs in {like} : {totalCount}
        </span>
      </div>
      <BlogsDisplay
        like={like}
        data={data}
        isLoading={isLoading}
        emptyMessage="No Blogs Found"
        error={error}
      />
    </section>
  );
};

export default AllBlogsPage;
