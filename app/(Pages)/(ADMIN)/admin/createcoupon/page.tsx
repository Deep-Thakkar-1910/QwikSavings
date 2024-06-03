import axios from "@/app/api/axios/axios";
import CreateCouponForm from "../../_Admincomponents/CreateCouponForm";

const CreateCouponPage = async () => {
  let categories = [];
  let stores = [];
  try {
    // fetching available stores and categories for related store and category fields
    const categoriesResult = await axios.get("/getcategories");
    const storesResult = await axios.get("/getstores");
    categories = categoriesResult.data.categories || [];
    stores = storesResult.data.stores || [];
  } catch (e) {
    console.error(e);
  }

  return (
    <article className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl sm:text-4xl">Create a new Coupon</h1>

      {/* Form container div */}
      <div className="mb-6 flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar md:w-full">
        <CreateCouponForm categories={categories} stores={stores} />
      </div>
    </article>
  );
};

export default CreateCouponPage;
