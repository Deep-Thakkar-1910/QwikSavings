import Link from "next/link";
import ContactForm from "./_ContactusComponents/ContactForm";
import Socials from "../_PageComponents/Socials";

const ContactUsPage = () => {
  return (
    <article className="my-8 flex flex-col items-center justify-center gap-8 px-4 sm:px-8 lg:px-16 ">
      <div className="mb-2 flex w-11/12 max-w-screen-lg flex-col items-center justify-center rounded-lg border-2 bg-white p-6 dark:bg-app-dark-navbar md:w-full lg:flex-row lg:items-start lg:justify-start">
        {/* Form container div */}
        <div className="flex w-full flex-col gap-y-4 lg:w-7/12">
          <h1 className="text-xl font-bold sm:text-2xl">Contact Us</h1>
          <p className="text-lg font-medium">
            Got any Question&apos;s? Don&apos;t hesitate to get in touch.
          </p>
          <p className="text-center lg:text-justify">
            Fill in the form below and one of our friendly customer support
            staff will contact you back ASAP regarding your question or query.
            You can also contact us via this email address:
            <Link
              href={"mailto:contact@qwiksavings.com"}
              className="block text-center text-sm font-semibold text-sky-500 sm:inline-block sm:text-base"
              target="_blank"
            >
              contact@qwiksavings.com
            </Link>
            . Please allow up-to 24 hours for a response - thank you!
          </p>
          <ContactForm />
        </div>
        <div className="flex h-full w-full flex-col items-center justify-between lg:w-1/3 lg:items-end">
          {/* PLaceholder for image */}
          <div className="h-[90%]" />
          <Socials />
        </div>
      </div>
    </article>
  );
};

export default ContactUsPage;
