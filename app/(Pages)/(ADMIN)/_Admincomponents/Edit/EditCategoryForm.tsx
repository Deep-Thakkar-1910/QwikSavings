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
import { CreateCategoryFormSchema } from "@/lib/FormSchemas/CreateCategoryFormSchema";
import Image from "next/image";
import { Info, MinusCircle } from "lucide-react";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { constructS3Url } from "@/lib/utilities/AwsConfig";

type InputType = z.infer<typeof CreateCategoryFormSchema>;

const EditCategoryForm = () => {
  const router = useRouter();
  const { categoryslug } = useParams();

  const [categoryDetails, setCategoryDetails] = useState<any>(null);

  const [showRemoveImageDialog, setShowRemoveImageDialog] =
    useState<boolean>(false);

  const [confirmRemoveLogo, setConfirmRemoveLogo] = useState<boolean | null>(
    false,
  );
  const [keyToDelete, setKeyToDelete] = useState<string | undefined>();

  // Fetch category details on component mount
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await axios.get(`/getcategorybyslug/${categoryslug}`);
        console.log(response.data);
        if (response.data.success) {
          setCategoryDetails(response.data.categoryDetails);
        }
      } catch (error) {
        console.error("Error fetching category details", error);
      }
    };

    fetchCategoryDetails();
  }, [categoryslug]);

  const form = useForm<InputType>({
    resolver: zodResolver(CreateCategoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      addToTodaysTopCategories: "no",
      logo: undefined,
    },
    mode: "all",
    shouldFocusError: true,
  });

  useEffect(() => {
    if (categoryDetails) {
      form.reset({
        name: categoryDetails.name,
        slug: categoryDetails.slug,
        description: categoryDetails.description ?? undefined,
        logo: undefined,
        addToTodaysTopCategories: categoryDetails.addToTodaysTopCategories
          ? "yes"
          : "no",
      });
      setSelectedImage(constructS3Url(categoryDetails.logo_url) ?? null);
    }
  }, [categoryDetails, form]);

  const { control, handleSubmit, formState, setValue } = form;

  const [selectedImage, setSelectedImage] = useState<string | null>(
    categoryDetails?.logo_url ?? null,
  );

  const imageRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("logo", file);
      setSelectedImage(URL.createObjectURL(file));
      setKeyToDelete(categoryDetails?.logo_url);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setValue("logo", undefined);
    if (imageRef.current) {
      imageRef.current.src = "";
      imageRef.current.value = "";
    }
    setConfirmRemoveLogo(true);
    setKeyToDelete(categoryDetails?.logo_url);
  };

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const formData = new FormData();
    if (data.logo) {
      formData.append("logo", data.logo);
    }
    const { logo, ...restData } = data;
    restData.logo_url = confirmRemoveLogo ? undefined : data.logo_url;
    restData.keyToDelete = keyToDelete;
    formData.append("data", JSON.stringify(restData));
    try {
      const result = await axios.put(
        `/editcategorybyslug/${categoryslug}`,
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
          description: "Category Updated Successfully",
        });
        router.push("/admin/categories");
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
        <FormItem>
          <div className="my-4 flex flex-col items-center gap-x-3 gap-y-4 sm:flex-row">
            <FormLabel>
              <span className="cursor-pointer rounded-lg border border-muted bg-transparent p-2 px-4 transition-colors duration-300 ease-out hover:bg-accent">
                {selectedImage ? "Change" : "Add"} Logo
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
                <div className="bg-neutral-700 dark:bg-app-dark">
                  <Image
                    src={selectedImage}
                    alt="Upload Image"
                    width={80}
                    height={80}
                    className="aspect-square"
                  />
                </div>
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
        <FormField
          control={control}
          name="addToTodaysTopCategories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add to Today&apos;s Top Categrories?</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                key={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
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
          {formState.isSubmitting ? "Updating..." : "Update Category"}
        </Button>
      </form>
    </Form>
  );
};
interface RemoveImageDialogProps {
  handleConfirmDelete: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}

const RemoveImageDialog: React.FC<RemoveImageDialogProps> = ({
  handleConfirmDelete,
  isDialogOpen,
  setIsDialogOpen,
}: RemoveImageDialogProps) => (
  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent className="w-11/12 max-w-96">
      <DialogHeader>
        <DialogTitle>Are you sure you want to delete this item?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete this Image
          if you press delete and update the category.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          className="my-4 border-app-main sm:mx-2 sm:my-0"
          onClick={() => setIsDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button className="bg-app-main" onClick={handleConfirmDelete}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default EditCategoryForm;
