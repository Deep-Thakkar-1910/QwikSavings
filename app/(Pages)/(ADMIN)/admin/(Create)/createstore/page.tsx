import CreateStoreForm from "../../../_Admincomponents/Create/CreateStoreForm";

const CreateStorePage = async () => {
  return (
    <article className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl sm:text-4xl">Create a new store</h1>
      {/* Form container div */}
      <div className="my-8 flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar md:w-full">
        <CreateStoreForm />
      </div>
    </article>
  );
};

export default CreateStorePage;
