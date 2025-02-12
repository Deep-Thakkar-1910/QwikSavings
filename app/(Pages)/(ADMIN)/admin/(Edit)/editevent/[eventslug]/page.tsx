import EditEventForm from "@/app/(Pages)/(ADMIN)/_Admincomponents/Edit/EditEventForm";

const EditEventPage = () => {
  return (
    <article className="mb-8 flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl sm:text-4xl">Edit Event</h1>

      {/* Form container div */}
      <div className="mb-2 flex w-11/12 max-w-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 md:w-full">
        <EditEventForm />
      </div>
    </article>
  );
};

export default EditEventPage;
