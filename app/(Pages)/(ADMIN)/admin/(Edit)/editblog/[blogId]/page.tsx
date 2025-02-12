import EditBlogForm from "@/app/(Pages)/(ADMIN)/_Admincomponents/Edit/EditBlogForm";

const EditBlogPage = async () => {
  let categories = [];
  try {
    // fetching available  categories for category field
    const categoriesResult = await fetch(
      `${process.env.BASE_URL}/api/getcategories?_=${new Date().getTime()}`,
      {
        cache: "no-cache",
      },
    );
    const categoriesData = await categoriesResult.json();
    categories = categoriesData.categories || [];
  } catch (e) {
    console.error(e);
  }
  return (
    <article className="my-8 flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl sm:text-4xl">Edit Blog</h1>

      {/* Form container div */}
      <div className="mb-2 flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 md:w-full">
        <EditBlogForm categories={categories} />
      </div>
    </article>
  );
};

export default EditBlogPage;
