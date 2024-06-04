import CreateCouponForm from "../../_Admincomponents/CreateCouponForm";

const CreateCouponPage = async () => {
  let categories = [];
  let stores = [];
  try {
    // fetching available stores and categories for related store and category fields
    const categoriesResult = await fetch(
      `${process.env.NEXTAUTH_URL}/api/getcategories`,
      {
        cache: "no-store",
      },
    );
    const storesResult = await fetch(
      `${process.env.NEXTAUTH_URL}/api/getstores`,
      { cache: "no-store" },
    );
    const categoriesData = await categoriesResult.json();
    const storesData = await storesResult.json();
    categories = categoriesData.categories || [];
    stores = storesData.stores || [];
  } catch (e) {
    console.error(e);
  }

  return (
    <article className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl sm:text-4xl">Create a new Coupon</h1>

      {/* Form container div */}
      <div className="mb-2 flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar md:w-full">
        <CreateCouponForm categories={categories} stores={stores} />
      </div>
    </article>
  );
};

export default CreateCouponPage;
