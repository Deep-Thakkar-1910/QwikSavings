import axios from "@/app/api/axios/axios";
import CreateCategoryForm from "../../_Admincomponents/CreatCategoryForm";

const CreateCatrgoryPage = async () => {
  let similarCategories = [];
  let stores = [];
  try {
    // fetching available stores and categories for related store and category fields
    const categoriesResult = await axios.get("/getcategories");
    const storesResult = await axios.get("/getstores");
    similarCategories = categoriesResult.data.categories || [];
    stores = storesResult.data.stores || [];
  } catch (e) {
    console.error(e);
  }
  return (
    <article className="mt-8 flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl sm:text-4xl">Create a new Category</h1>

      {/* Form container div */}
      <div className="mb-6 flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar md:w-full">
        <CreateCategoryForm
          similarCategories={similarCategories}
          stores={stores}
        />
      </div>
    </article>
  );
};

export default CreateCatrgoryPage;
