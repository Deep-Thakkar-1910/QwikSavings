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

import axios from "@/app/api/axios/axios";
import { AxiosError } from "axios";
import Image from "next/image";
import { CheckIcon, MinusCircle } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { CreateBlogFormSchema } from "@/lib/FormSchemas/CreateBlogFormSchema";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useParams, useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type InputType = z.infer<typeof CreateBlogFormSchema>;

const EditBlogForm = ({
  categories,
}: {
  categories: { name: string; categoryId: number }[];
}) => {
  const { blogId } = useParams();
  const router = useRouter();
  const [blogDetails, setBlogDetails] = useState<any>(null);

  // Fetch category details on component mount
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(`/getblogbyid/${blogId}`);
        if (response.data.success) {
          setBlogDetails(response.data.blogDetails);
        }
      } catch (error) {
        console.error("Error fetching category details", error);
      }
    };

    fetchBlogDetails();
  }, [blogId]);
  const form = useForm<InputType>({
    resolver: zodResolver(CreateBlogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      thumbnail: undefined,
      thumbnail_url: "",
      category_id: "",
    },
    mode: "all",
    shouldFocusError: true,
  });

  const { control, handleSubmit, formState, setValue } = form;

  useEffect(() => {
    if (blogDetails) {
      form.reset({
        title: blogDetails.title,
        thumbnail: undefined,
        thumbnail_url: blogDetails.thumbnail_url ?? "",
        content: blogDetails.content,
        category_id: `${blogDetails.category_id}` ?? "",
      });
      setSelectedImage(blogDetails.logo_url);
    }
  }, [blogDetails, form]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("thumbnail", file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setValue("thumbnail", undefined);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const formData = new FormData();
    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }
    const { thumbnail, ...restData } = data;
    formData.append("data", JSON.stringify(restData));
    try {
      const result = await axios.put(`/editblog?blogId=${blogId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (result.data.success) {
        toast({
          title: "Success",
          description: "Blog Updated Successfully",
        });
        router.push("/admin/blogs");
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
      setSelectedImage(null);
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blog Title</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Input
                  placeholder="Enter a Blog Title"
                  {...field}
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <div className="my-4 flex flex-col items-center gap-x-3 gap-y-4 sm:flex-row">
            <FormLabel>
              <span className="cursor-pointer rounded-lg border border-muted bg-transparent p-2 px-4 transition-colors duration-300 ease-out hover:bg-accent">
                {selectedImage ? "Change" : "Add"} Thumbnail
              </span>
            </FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                ref={imageRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </FormControl>
            {selectedImage && (
              <>
                <Image
                  src={selectedImage}
                  alt="Upload Image"
                  width={80}
                  height={80}
                  className="aspect-square"
                />
                <MinusCircle
                  className="size-6 translate-y-1/2 cursor-pointer text-destructive"
                  onClick={removeImage}
                />
              </>
            )}
          </div>
          <FormMessage />
        </FormItem>
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blog Content</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="category_id"
          render={({ field }) => (
            <FormItem className="flex w-fit flex-col gap-2">
              <FormLabel>
                Related Category<sup className="text-app-main">*</sup>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? categories.find(
                            (category) =>
                              `${category.categoryId}` === field.value,
                          )?.name
                        : "Select a Category"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command
                    filter={(value, search) => {
                      if (value.toLowerCase().includes(search.toLowerCase())) {
                        return 1;
                      }
                      return 0;
                    }}
                  >
                    <CommandInput
                      placeholder="Search Category..."
                      className="h-9"
                    />
                    <CommandEmpty>No Category found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {categories.map((category) => (
                          <CommandItem
                            key={category.categoryId}
                            onSelect={() => {
                              form.setValue(
                                "category_id",
                                `${category.categoryId}`,
                              );
                            }}
                            value={`${category.name}`.toLowerCase()}
                          >
                            {category.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                `${category.categoryId}` === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
          {formState.isSubmitting ? "Updating..." : "Update Blog"}
        </Button>
      </form>
    </Form>
  );
};

export default EditBlogForm;
