import EditStoreForm from "@/app/(Pages)/(ADMIN)/_Admincomponents/Edit/EditStoreForm";

const EditStorePage = () => {
  return (
    <article className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl sm:text-4xl">Edit Store</h1>
      {/* Form container div */}
      <div className="my-8 flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar md:w-full">
        <EditStoreForm />
      </div>
    </article>
  );
};

export default EditStorePage;
