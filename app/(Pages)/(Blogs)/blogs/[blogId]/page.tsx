// app/blog/[blogId]/page.tsx (Server Component)

import { Metadata } from "next";
import BlogDetailsPage from "@/app/(Pages)/(Blogs)/_BlogComponents/BlogDetailsPage";

interface Params {
  params: {
    blogId: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { blogId } = params;

  // Optionally fetch blog details for metadata if needed
  // const blogData = await fetchBlogData(blogId);

  return {
    title: `Blog ${blogId} - Details`,
    description: `Read all about Blog ${blogId} and discover in-depth content and insights.`,
  };
}

const BlogPage = ({ params }: Params) => {
  return <BlogDetailsPage blogId={params.blogId} />;
};

export default BlogPage;
