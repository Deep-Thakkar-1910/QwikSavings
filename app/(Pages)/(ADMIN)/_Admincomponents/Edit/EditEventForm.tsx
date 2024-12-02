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
import { Info, MinusCircle } from "lucide-react";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CreateEventFormSchema } from "@/lib/FormSchemas/CreateEventFormSchema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type InputType = z.infer<typeof CreateEventFormSchema>;

const EditEventForm = () => {
  const router = useRouter();
  const { eventslug } = useParams();

  const [eventDetails, setEventDetails] = useState<any>(null);

  // Fetch Event details on component mount
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await axios.get(`/geteventbyslug/${eventslug}`);
        if (response.data.success) {
          setEventDetails(response.data.eventDetails);
        }
      } catch (error) {
        console.error("Error fetching category details", error);
      }
    };

    fetchCategoryDetails();
  }, [eventslug]);

  const form = useForm<InputType>({
    resolver: zodResolver(CreateEventFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
    mode: "all",
    shouldFocusError: true,
  });

  useEffect(() => {
    if (eventDetails) {
      form.reset({
        name: eventDetails.name,
        slug: eventDetails.slug,
        title: eventDetails.title ?? undefined,
        description: eventDetails.description ?? undefined,
        logo_url: undefined,
        cover_url: undefined,
      });
      setSelectedLogo(eventDetails.logo_url);
      setSelectedCover(eventDetails.cover_url);
    }
  }, [eventDetails, form]);

  const { control, handleSubmit, formState, setValue } = form;

  const [selectedLogo, setSelectedLogo] = useState<string | null>(
    eventDetails?.logo_url ?? null,
  );
  const [selectedCover, setSelectedCover] = useState<string | null>(
    eventDetails?.cover_url ?? null,
  );

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

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const formData = new FormData();
    if (data.logo_url) {
      formData.append("logo_url", data.logo_url);
    }
    if (data.cover_url) {
      formData.append("cover_url", data.cover_url);
    }
    const { logo_url, cover_url, ...restData } = data;
    restData.logoUrl = eventDetails.logo_url;
    restData.coverUrl = eventDetails.cover_url;
    formData.append("data", JSON.stringify(restData));
    try {
      const result = await axios.put(
        `/editeventbyslug/${eventslug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (result.data.success) {
        toast({
          title: "Success",
          description: "Event Updated Successfully",
        });
        router.push("/admin/events");
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
              <FormLabel>Event Name</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Input
                  placeholder="Enter the event Name"
                  {...field}
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Input placeholder="Enter Slug here" {...field} type="text" />
              </FormControl>
              <div className="flex items-center gap-2">
                <FormMessage />
                {formState.errors.slug && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-4 cursor-pointer text-accent-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover-foreground text-popover">
                        <p>
                          A valid slug looks like{" "}
                          <strong className="font-extrabold">abc-xyz</strong>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
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
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Textarea {...field} placeholder="About Category" />
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
          {formState.isSubmitting ? "Editing..." : "Edit Event"}
        </Button>
      </form>
    </Form>
  );
};

export default EditEventForm;
