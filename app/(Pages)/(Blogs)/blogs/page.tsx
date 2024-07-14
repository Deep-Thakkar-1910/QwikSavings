import db from "@/lib/prisma";
import BlogDisplay from "../_BlogComponents/BlogsDisplay";

/*export async function generateStaticParams() {
  const blogs = await db.blog.findMany({});
  return {
    paths: blogs.slice(0, 6).map((blog) => blog.blogId),
  };
}*/
const EventPage = () => {
  return (
    <section className="mx-auto mb-10 flex w-full max-w-screen-xl flex-col  items-start px-4 sm:px-8 lg:px-16 xl:px-2 2xl:px-0">
      <h1 className="text-xl font-bold sm:text-2xl">Blogs</h1>
      <BlogDisplay />
    </section>
  );
};

export default EventPage;
