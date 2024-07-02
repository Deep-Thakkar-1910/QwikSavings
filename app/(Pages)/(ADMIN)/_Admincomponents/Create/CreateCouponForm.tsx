"use client";
import { ChangeEvent, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AxiosError } from "axios";
import { CreateCouponFormSchema } from "@/lib/FormSchemas/CreateCouponFormSchema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, CheckIcon, MinusCircle } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/MultipleSelector";

type InputType = z.infer<typeof CreateCouponFormSchema>;

interface CouponFormProps {
  categories: { name: string; categoryId: number }[];
  stores: { name: string; storeId: number }[];
  events: { name: string; eventId: number }[];
}

const CreateCouponForm = ({ categories, stores, events }: CouponFormProps) => {
  // for image preview
  const [selectedThumbnailImage, setSelectedThumbnailImage] = useState<
    string | null
  >(null);
  const [selectedFlipperImage, setSelectedFlipperImage] = useState<
    string | null
  >(null);
  const [selectedCarouselImage, setSelectedCarouselImage] = useState<
    string | null
  >(null);

  // reference to the image input field
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const flipperRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLInputElement>(null);

  // date picker state
  const [date, setDate] = useState<Date | undefined>(new Date());
  const form = useForm<InputType>({
    resolver: zodResolver(CreateCouponFormSchema),
    defaultValues: {
      title: "",
      coupon_code: "",
      description: "",
      ref_link: "",
      thumbnail_url: "",
      flipperImage_url: "",
      carouselPosterUrl: "",
      addToCarousel: "no",
      addToHomePage: "no",
      addToFlipper: "no",
      category_id: "",
      store_id: "",
      type: "Deal",
      events: [],
      due_date: undefined,
    },
    mode: "all",
    shouldFocusError: true,
  });

  const { control, setValue, handleSubmit, formState } = form;

  const eventOptions = events?.map((event) => {
    return {
      label: event.name,
      id: `${event?.eventId}`,
    };
  });

  // handle thumbnail image onChange event
  const handleThumbnailChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // const resizedFile = await resizeThumbnailImage(file);
      setValue("thumbnail_url", file);
      setSelectedThumbnailImage(URL.createObjectURL(file));
    }
  };
  // handle Flipper image onChange event
  const handleFlipperChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // const resizedFile = await resizeFlipperImage(file);
      setValue("flipperImage_url", file);
      setSelectedFlipperImage(URL.createObjectURL(file));
    }
  };
  // handle Carousel image onChange event
  const handleCarouselChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // const resizedFile = await resizeCarouselPoster(file);
      setValue("carouselPosterUrl", file);
      setSelectedCarouselImage(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    setSelectedThumbnailImage(null);
    setValue("thumbnail_url", undefined);
    if (thumbnailRef.current) {
      thumbnailRef.current.src = "";
      thumbnailRef.current.value = "";
    }
  };
  const removeFlipper = () => {
    setSelectedFlipperImage(null);
    setValue("flipperImage_url", undefined);
    if (flipperRef.current) {
      flipperRef.current.src = "";
      flipperRef.current.value = "";
    }
  };
  const removeCarousel = () => {
    setSelectedCarouselImage(null);
    setValue("carouselPosterUrl", undefined);
    if (carouselRef.current) {
      carouselRef.current.src = "";
      carouselRef.current.value = "";
    }
  };
  // form submission handler
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const formData = new FormData();
    if (data.thumbnail_url) {
      formData.append("thumbnail_url", data.thumbnail_url);
    }
    if (data.flipperImage_url) {
      formData.append("flipperImage_url", data.flipperImage_url);
    }
    if (data.carouselPosterUrl) {
      formData.append("carouselPosterUrl", data.carouselPosterUrl);
    }
    // extracting the thumbnail from rest of data to not clutter api request
    const { thumbnail_url, carouselPosterUrl, flipperImage_url, ...restData } =
      data;
    formData.append("data", JSON.stringify(restData));
    try {
      const result = await axios.post("/createcoupon", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (result.data.success) {
        toast({
          title: "Success",
          description: "Coupon created successfully",
        });
        form.reset();
        removeCarousel();
        removeFlipper();
        removeThumbnail();
        setValue("addToHomePage", "no");
        setValue("addToCarousel", "no");
        setValue("addToFlipper", "no");
        setDate(undefined);
      }
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        toast({
          title: "Uh Oh!",
          description: err.response?.data.error,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Input placeholder="Coupon title" {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Coupon Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Coupon Type <sup className="text-app-main">*</sup>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Deal">Deal</SelectItem>
                  <SelectItem value="Coupon">Coupon</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.getValues("type") === "Coupon" && (
          <FormField
            control={control}
            name="coupon_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <sup className="text-app-main">*</sup>
                <FormControl>
                  <Input
                    placeholder="Enter coupon code"
                    {...field}
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={control}
          name="addToHomePage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add to Home Page?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Type" />
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
        {/* IF add to homepage is yes conditionally render this field */}
        {form.getValues("addToHomePage") === "yes" && (
          <FormItem>
            <div className="my-4 flex items-center gap-x-3 ">
              <FormLabel>
                <span className="cursor-pointer rounded-lg border border-muted bg-transparent p-2 px-4 transition-colors duration-300 ease-out hover:bg-accent">
                  {selectedThumbnailImage ? "Change" : "Add"} Thumbnail
                </span>
              </FormLabel>
              <FormControl>
                <input
                  ref={thumbnailRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </FormControl>
              {selectedThumbnailImage && (
                <>
                  <Image
                    src={selectedThumbnailImage}
                    alt="Upload Image"
                    width={80}
                    height={80}
                    className="aspect-square"
                  />
                  <MinusCircle
                    className="size-6 translate-y-1/2 cursor-pointer text-destructive"
                    onClick={removeThumbnail}
                  />
                </>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
        {/* Carousel Field */}
        <FormField
          control={control}
          name="addToCarousel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add to Carousel?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Type" />
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
        {/* IF add to Carousel is yes conditionally render this field */}
        {form.getValues("addToCarousel") === "yes" && (
          <FormItem>
            <div className="my-4 flex items-center gap-x-3 ">
              <FormLabel>
                <span className="cursor-pointer rounded-lg border border-muted bg-transparent p-2 px-4 transition-colors duration-300 ease-out hover:bg-accent">
                  {selectedCarouselImage ? "Change" : "Add"} Carousel Poster
                </span>
              </FormLabel>
              <FormControl>
                <input
                  ref={carouselRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCarouselChange}
                  className="hidden"
                />
              </FormControl>
              {selectedCarouselImage && (
                <>
                  <Image
                    src={selectedCarouselImage}
                    alt="Upload Image"
                    width={80}
                    height={80}
                    className="aspect-square"
                  />
                  <MinusCircle
                    className="size-6 translate-y-1/2 cursor-pointer text-destructive"
                    onClick={removeCarousel}
                  />
                </>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}

        {/* Flipper Field */}
        <FormField
          control={control}
          name="addToFlipper"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add to Flipper?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Type" />
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
        {/* IF add to Flipper is yes conditionally render this field */}
        {form.getValues("addToFlipper") === "yes" && (
          <FormItem>
            <div className="my-4 flex items-center gap-x-3 ">
              <FormLabel>
                <span className="cursor-pointer rounded-lg border border-muted bg-transparent p-2 px-4 transition-colors duration-300 ease-out hover:bg-accent">
                  {selectedFlipperImage ? "Change" : "Add"} Flipper Image
                </span>
              </FormLabel>
              <FormControl>
                <input
                  ref={flipperRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFlipperChange}
                  className="hidden"
                />
              </FormControl>
              {selectedFlipperImage && (
                <>
                  <Image
                    src={selectedFlipperImage}
                    alt="Upload Image"
                    width={80}
                    height={80}
                    className="aspect-square"
                  />
                  <MinusCircle
                    className="size-6 translate-y-1/2 cursor-pointer text-destructive"
                    onClick={removeThumbnail}
                  />
                </>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
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
        <FormField
          control={control}
          name="store_id"
          render={({ field }) => (
            <FormItem className="flex w-fit flex-col gap-2">
              <FormLabel>
                Related Store <sup className="text-app-main">*</sup>
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
                        ? stores.find(
                            (store) => `${store.storeId}` === field.value,
                          )?.name
                        : "Select a store"}
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
                      placeholder="Search Store..."
                      className="h-9"
                    />
                    <CommandEmpty>No Store found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {stores.map((store) => (
                          <CommandItem
                            key={store.storeId}
                            onSelect={() => {
                              form.setValue("store_id", `${store.storeId}`);
                            }}
                            value={`${store.name}`.toLowerCase()}
                          >
                            {store.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                `${store.storeId}` === field.value
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
        <FormField
          control={control}
          name="events"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Similar Stores</FormLabel>
              <MultiSelector
                onValuesChange={field.onChange}
                values={field.value}
                loop={false}
                options={eventOptions}
                emptyIndicator="No Stores Found"
              >
                <FormControl>
                  <MultiSelectorTrigger>
                    <MultiSelectorInput
                      placeholder={
                        field.value.length <= 0 ? "Select Related Stores" : ""
                      }
                    />
                  </MultiSelectorTrigger>
                </FormControl>
                <MultiSelectorContent>
                  <MultiSelectorList>
                    {events?.map((event) => (
                      <MultiSelectorItem
                        key={event.eventId}
                        value={`${event.eventId}`}
                        id={event.eventId.toString()}
                        label={event.name}
                      >
                        {event.name}
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
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex w-fit flex-col gap-2">
              <FormLabel>
                Expiry Date <sup className="text-app-main">*</sup>
              </FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "dd-MMM-yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className=" w-auto p-0">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown-buttons"
                      selected={date}
                      onSelect={(currentDate) => {
                        setDate(currentDate);
                        form.setValue("due_date", currentDate!);
                      }}
                      fromDate={new Date()}
                      toYear={date?.getFullYear()! + 10}
                    />
                  </PopoverContent>
                </Popover>
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
          {formState.isSubmitting ? "Creating..." : "Create Coupon"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateCouponForm;
