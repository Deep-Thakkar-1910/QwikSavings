import CreateCouponForm from "../../../_Admincomponents/Create/CreateCouponForm";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const CreateCouponPage = async () => {
  let categories = [];
  let stores = [];
  let events = [];
  try {
    // fetching available stores and categories for related store and category fields
    const categoriesResult = await fetch(
      `${process.env.BASE_URL}/api/getcategories?_=${new Date().getTime()}`,
      {
        cache: "no-cache",
      },
    );
    const storesResult = await fetch(
      `${process.env.BASE_URL}/api/getstores?_=${new Date().getTime()}`,
      {
        cache: "no-cache",
      },
    );
    const categoriesData = await categoriesResult.json();
    const storesData = await storesResult.json();
    categories = categoriesData.categories || [];
    stores = storesData.stores || [];
  } catch (e) {
    console.error(e);
  }
  try {
    const storesResult = await fetch(
      `${process.env.BASE_URL}/api/getevents?_=${new Date().getTime()}`,
      {
        cache: "no-cache",
      },
    );

    const eventsData = await storesResult.json();
    events = eventsData.events || [];
  } catch (e) {
    console.error(e);
  }

  return (
    <article className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl sm:text-4xl">Create a new Coupon</h1>

      {/* Form container div */}
      <div className="my-8 flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar md:w-full">
        <CreateCouponForm
          categories={categories}
          stores={stores}
          events={events}
        />
      </div>
    </article>
  );
};

export default CreateCouponPage;
