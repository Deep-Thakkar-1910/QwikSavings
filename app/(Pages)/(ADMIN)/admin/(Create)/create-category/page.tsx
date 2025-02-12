import CreateCategoryForm from "../../../_Admincomponents/Create/CreateCategoryForm";

const CreateCatrgoryPage = async () => {
  return (
    <article className="my-8 flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl sm:text-4xl">Create a new Category</h1>

      {/* Form container div */}
      <div className="mb-2 flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 md:w-full">
        <CreateCategoryForm />
      </div>
    </article>
  );
};

export default CreateCatrgoryPage;
