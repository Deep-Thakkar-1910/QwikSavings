"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";

import Image from "next/image";
import { MinusCircle } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { CreateEventFormSchema } from "@/lib/FormSchemas/CreateEventFormSchema";

type InputType = z.infer<typeof CreateEventFormSchema>;

const CreateEventForm = () => {
  // decalring the form object
  const form = useForm<InputType>({
    resolver: zodResolver(CreateEventFormSchema),
    defaultValues: {
      name: "",
      title: "",
      description: "",
      cover_url: "",
      logo_url: "",
    },
    mode: "all",
    shouldFocusError: true,
  });

  const { control, handleSubmit, formState, setValue } = form;

  // for image preview
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [selectedCover, setSelectedCover] = useState<string | null>(null);

  // Image ref
  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  // handle logo image onChange event
  const handleLogoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("logo_url", file);
      setSelectedLogo(URL.createObjectURL(file));
    }
  };
  // handle logo image onChange event
  const handleCoverChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("cover_url", file);
      setSelectedCover(URL.createObjectURL(file));
    }
  };

  // function to remove the selected Logo Image
  const removeLogo = () => {
    setSelectedLogo(null);
    setValue("logo_url", undefined);
    if (logoRef.current) {
      logoRef.current.src = "";
      logoRef.current.value = "";
    }
  };
  // function to remove the selected Cover Image
  const removeCover = () => {
    setSelectedCover(null);
    setValue("cover_url", undefined);
    if (coverRef.current) {
      coverRef.current.src = "";
      coverRef.current.value = "";
    }
  };

  // form submission handler
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const formData = new FormData();
    if (data.logo_url) {
      formData.append("logo_url", data.logo_url);
    }
    if (data.cover_url) {
      formData.append("cover_url", data.cover_url);
    }
    const { logo_url, cover_url, ...restData } = data;
    formData.append("data", JSON.stringify(restData));
    try {
      const result = await axios.post("/createevent", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (result.data.success) {
        toast({
          title: "Success",
          description: "Event Created Successfully",
        });
        form.reset();
        setSelectedLogo(null);
        setSelectedCover(null);
      }
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        toast({
          title: "Uh Oh!",
          description: err.response?.data.error,
          variant: "destructive",
        });
      }
      setSelectedLogo(null);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-4"
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Input
                  placeholder="Enter a Category Name"
                  {...field}
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Logo Image field */}
        <FormItem>
          <div className="my-4 flex flex-col items-center gap-x-3 gap-y-4 sm:flex-row">
            <FormLabel>
              <span className="cursor-pointer rounded-lg border border-muted bg-transparent p-2 px-4 transition-colors duration-300 ease-out hover:bg-accent">
                {selectedLogo ? "Change" : "Add"} Logo
              </span>
            </FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                ref={logoRef}
                onChange={handleLogoChange}
                className="hidden"
              />
            </FormControl>
            {selectedLogo && (
              <>
                <Image
                  src={selectedLogo}
                  alt="Upload Image"
                  width={80}
                  height={80}
                  className="aspect-square"
                />
                <MinusCircle
                  className="size-6 translate-y-1/2 cursor-pointer text-destructive"
                  onClick={removeLogo}
                />
              </>
            )}
          </div>
          <FormMessage />
        </FormItem>
        {/* Cover Image field */}
        <FormItem>
          <div className="my-4 flex items-center gap-x-3">
            <FormLabel>
              <span className="cursor-pointer rounded-lg border border-muted bg-transparent p-2 px-4 transition-colors duration-300 ease-out hover:bg-accent">
                {selectedCover ? "Change" : "Add"} Cover
              </span>
            </FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                ref={coverRef}
                onChange={handleCoverChange}
                className="hidden"
              />
            </FormControl>
            {selectedCover && (
              <>
                <Image
                  src={selectedCover}
                  alt="Upload Image"
                  width={80}
                  height={80}
                  className="aspect-square"
                />
                <MinusCircle
                  className="size-6 translate-y-1/2 cursor-pointer text-destructive"
                  onClick={removeCover}
                />
              </>
            )}
          </div>
          <FormMessage />
        </FormItem>
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="About Event" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="mt-2 place-self-center text-xs text-gray-400">
          Fields marked with<span className="text-app-main"> * </span>are
          required
        </p>

        <Button
          type="submit"
          className="w-full place-self-center rounded-lg hover:shadow-md"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateEventForm;
