import EditFestivalForm from "../../../../_Admincomponents/Edit/EditFestivalForm";

const EditFestival = () => {
  return (
    <article className="my-8 flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl sm:text-4xl">Edit Festival</h1>

      {/* Form container div */}
      <div className="mb-2 flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar md:w-full">
        <EditFestivalForm />
      </div>
    </article>
  );
};

export default EditFestival;
