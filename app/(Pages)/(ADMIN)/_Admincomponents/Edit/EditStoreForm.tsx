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
import { useFieldArray } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { CreateStoreFormScehma } from "@/lib/FormSchemas/CreateStoreFormSchema";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/app/api/axios/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import Image from "next/image";
import { Info, MinusCircle } from "lucide-react";
import { AxiosError } from "axios";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/ui/RichTextEditor";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/MultipleSelector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { constructS3Url } from "@/lib/utilities/AwsConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type InputType = z.infer<typeof CreateStoreFormScehma>;
interface StoreFormProps {
  similarStores?: { name: string; storeId: number }[];
}
const EditStoreForm = ({ similarStores = [] }: StoreFormProps) => {
  const router = useRouter();
  const { storeslug } = useParams();

  const similarStoreOptions = similarStores.map((store) => {
    return {
      label: store.name,
      id: `${store.storeId}`,
    };
  });

  // for image preview
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // reference to the image input field
  const imageRef = useRef<HTMLInputElement>(null);

  const form = useForm<InputType>({
    resolver: zodResolver(CreateStoreFormScehma),
    defaultValues: {
      name: "",
      slug: "",
      title: "",
      logo: undefined,
      ref_link: "",
      isFeatured: "no",
      addToPopularStores: "no",
      average_discount: "",
      best_offer: "",
      description: "",
      hint: "",
      hintHeading: "",
      moreAbout: "",
      faq: [],
    },
    mode: "all",
    shouldFocusError: true,
  });

  const { control, handleSubmit, formState, setValue, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faq",
  });

  const [storeDetails, setStoreDetails] = useState<Record<string, any>>();
  const [showRemoveImageDialog, setShowRemoveImageDialog] =
    useState<boolean>(false);

  const [confirmRemoveLogo, setConfirmRemoveLogo] = useState<boolean | null>(
    false,
  );
  const [keyToDelete, setKeyToDelete] = useState<string | undefined>();
  // Fetch store data for editing
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(`/getstorebyslug/${storeslug}`);
        const data = response.data.storeDetails;
        setStoreDetails(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Error fetching store details.",
          variant: "destructive",
        });
      }
    };
    fetchStoreData();
  }, [storeslug]);

  useEffect(() => {
    if (storeDetails) {
      const storeIds =
        storeDetails?.similarStores?.map((store: any) =>
          store?.storeId?.toString(),
        ) || [];
      reset({
        name: storeDetails.name,
        slug: storeDetails.slug,
        title: storeDetails.title,
        ref_link: storeDetails.ref_link,
        logo: undefined,
        description: storeDetails.description ?? undefined,
        moreAbout: storeDetails.moreAbout ?? "",
        hint: storeDetails.hint ?? "",
        hintHeading: storeDetails.hintHeading ?? "",
        best_offer: storeDetails.best_offer,
        average_discount: storeDetails.average_discount,
        faq: JSON.parse(storeDetails?.faq as unknown as string),
        similarStores: storeIds,
        isFeatured: storeDetails.isFeatured ? "yes" : "no",
        addToPopularStores: storeDetails.addToPopularStores ? "yes" : "no",
      });
      setSelectedImage(constructS3Url(storeDetails.logo_url) ?? null);
    }
  }, [storeDetails, reset]);

  // handle logo image onChange event
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("logo", file);
      setSelectedImage(URL.createObjectURL(file));
      setKeyToDelete(storeDetails?.logo_url);
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
    setKeyToDelete(storeDetails?.logo_url);
  };

  // form submission handler
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const formData = new FormData();
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    // Remove the logo from the data object to not clutter the form data
    const { logo, ...restData } = data;
    restData.logo_url = confirmRemoveLogo ? undefined : storeDetails?.logo_url;
    restData.keyToDelete = keyToDelete;
    formData.append("data", JSON.stringify(restData));

    try {
      const response = await axios.put(
        `/editstorebyslug/${storeslug}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      const result = response.data;
      if (result.success) {
        toast({
          title: "Success",
          description: "Store updated successfully.",
        });
        router.push("/admin"); // Redirect to store listing or details page
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast({
          title: "Uh Oh!",
          description: error.response?.data.error || "An error occurred.",
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
              <FormLabel>Name</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Input placeholder="Store Name" {...field} type="text" />
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
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Store Title" {...field} type="text" />
              </FormControl>
              <FormMessage />
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
                ref={imageRef}
                type="file"
                accept="image/*"
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
                  onClick={() => {
                    setShowRemoveImageDialog(true);
                  }}
                />
              </>
            )}
          </div>
          <FormMessage />
        </FormItem>
        <RemoveImageDialog
          handleConfirmDelete={() => {
            setShowRemoveImageDialog(false);
            removeImage();
          }}
          isDialogOpen={showRemoveImageDialog}
          setIsDialogOpen={setShowRemoveImageDialog}
        />
        <FormField
          control={control}
          name="ref_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Link</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  type="url"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feature Store </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="No" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="addToPopularStores"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add to Popular Stores?</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
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
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Us</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Textarea placeholder="About Us" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="moreAbout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>More About Store</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={(newContent) => {
                    field.onChange(newContent);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hintHeading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heading For How to Apply</FormLabel>
              <FormControl>
                <Input
                  placeholder="Heading For How to Apply"
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
          name="hint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How To Apply</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={(newContent) => {
                    field.onChange(newContent);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="best_offer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Best Offer</FormLabel>
              <FormControl>
                <Input placeholder="40$" {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="average_discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Average Discount</FormLabel>
              <FormControl>
                <Input placeholder="20%" {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="similarStores"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Similar Stores</FormLabel>
              <MultiSelector
                onValuesChange={field.onChange}
                values={field?.value || []}
                loop={false}
                options={similarStoreOptions}
                emptyIndicator="No Stores Found"
              >
                <FormControl>
                  <MultiSelectorTrigger>
                    <MultiSelectorInput
                      placeholder={
                        field?.value?.length <= 0 ? "Select Related Stores" : ""
                      }
                    />
                  </MultiSelectorTrigger>
                </FormControl>
                <MultiSelectorContent>
                  <MultiSelectorList>
                    {similarStores.map((store) => (
                      <MultiSelectorItem
                        key={store.storeId}
                        value={`${store.storeId}`}
                        id={store.storeId.toString()}
                        label={store.name}
                      >
                        {store.name}
                      </MultiSelectorItem>
                    ))}
                  </MultiSelectorList>
                </MultiSelectorContent>
                <FormMessage />
              </MultiSelector>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="faq"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FAQs</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  <div className="flex items-center gap-x-2">
                    <FormField
                      control={control}
                      name={`faq.${index}.question`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Question {index + 1}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Question ${index + 1}`}
                              {...field}
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <MinusCircle
                      className="size-6 translate-y-1/2 cursor-pointer text-destructive"
                      onClick={() => remove(index)}
                    />
                  </div>
                  <FormField
                    control={control}
                    name={`faq.${index}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer {index + 1}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`Answer for Q.${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="outline"
          size={"lg"}
          onClick={() => append({ question: "", answer: "" })}
          className="place-self-center rounded-lg hover:shadow-md"
        >
          Add FAQ
        </Button>
        <p className="mt-2 place-self-center text-xs text-gray-400">
          Fields marked with<span className="text-app-main"> * </span>are
          required
        </p>
        <Button type="submit" disabled={formState.isSubmitting}>
          Update Store
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
          if you press delete and update the store.
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
export default EditStoreForm;
