import CreateStoreForm from "../../_Admincomponents/CreateStoreForm";

const CreateStorePage = async () => {
  let categories = [];
  let similarStores = [];
  try {
    // for prod
    const categoriesResult = await fetch(
      `${process.env.BASE_URL}/api/getcategories`,
      { cache: "no-store" },
    );
    const categoriesData = await categoriesResult.json();
    const storesResult = await fetch(`${process.env.BASE_URL}/api/getstores`, {
      cache: "no-store",
    });
    const storesData = await storesResult.json();
    categories = categoriesData.categories || [];
    similarStores = storesData.stores || [];
  } catch (e) {
    console.error(e);
  }

  return (
    <article className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl sm:text-4xl">Create a new store</h1>

      {/* Form container div */}
      <div className="mb-2 flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar md:w-full">
        <CreateStoreForm
          categories={categories}
          similarStores={similarStores}
        />
      </div>
    </article>
  );
};

export default CreateStorePage;
