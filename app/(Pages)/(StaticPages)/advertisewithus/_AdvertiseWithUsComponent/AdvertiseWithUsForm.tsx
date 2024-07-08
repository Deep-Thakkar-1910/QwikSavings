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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { sendAdvertiseWithUsMail } from "@/lib/Mail/AdvertiseWithUs";
import Link from "next/link";

const AdvertiseWithUsFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  companyName: z.string().min(1, "Company name is required"),
  websiteUrl: z.string().url("Invalid URL"),
  email: z.string().email("Invalid email address"),
  isAffiliateNetwork: z.enum(["Yes", "No"]),
  message: z.string().min(1, "Message is required"),
  acceptPrivacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy",
  }),
});

type AdvertiseWithUsFormInputs = z.infer<typeof AdvertiseWithUsFormSchema>;

const AdvertiseWithUsForm = () => {
  const form = useForm<AdvertiseWithUsFormInputs>({
    resolver: zodResolver(AdvertiseWithUsFormSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      websiteUrl: "",
      email: "",
      isAffiliateNetwork: "No",
      message: "",
      acceptPrivacyPolicy: false,
    },
  });

  const onSubmit = async (data: AdvertiseWithUsFormInputs) => {
    try {
      const result = await sendAdvertiseWithUsMail(data);
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
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Company Name<sup className="text-app-main">*</sup>
              </FormLabel>
              <FormControl>
                <Input placeholder="Your Company" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Website URL<sup className="text-app-main">*</sup>
              </FormLabel>
              <FormControl>
                <Input placeholder="https://www.example.com" {...field} />
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
          name="isAffiliateNetwork"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are you in an affiliate network?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="Yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="No" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
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
                  <Link
                    href="/privacypolicy"
                    className="text-sky-600
                  hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          size={"lg"}
          className="w-fit"
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit Form"}
        </Button>
      </form>
    </Form>
  );
};

export default AdvertiseWithUsForm;
