"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { sendContactMail } from "@/lib/Mail/Contact";

const ContactFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  acceptPrivacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy",
  }),
});

type ContactFormInputs = z.infer<typeof ContactFormSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormInputs>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
      acceptPrivacyPolicy: false,
    },
  });

  const onSubmit = async (data: ContactFormInputs) => {
    setIsSubmitting(true);
    try {
      const result = await sendContactMail(data);
      if (result.success) {
        toast({
          title: "Success",
          description: "Your message has been sent successfully.",
        });
        form.reset();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("An error occurred", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-stretch space-y-4"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Full Name<sup className="text-app-main">*</sup>
              </FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email Address<sup className="text-app-main">*</sup>
              </FormLabel>
              <FormControl>
                <Input placeholder="johndoe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Subject<sup className="text-app-main">*</sup>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Message<sup className="text-app-main">*</sup>
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceptPrivacyPolicy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I accept the{" "}
                  <a
                    href="/privacypolicy"
                    className="text-sky-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isValid || isSubmitting}
          size={"lg"}
          className="w-fit"
        >
          {isSubmitting ? "Submitting..." : "Submit Form"}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
