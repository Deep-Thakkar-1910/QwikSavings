"use client";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/Calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { CreateUserCouponFormSchema } from "@/lib/FormSchemas/CreateUserCouponFormSchema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "@/app/api/axios/axios";

type InputType = z.infer<typeof CreateUserCouponFormSchema>;

const CreateUserCouponForm = ({}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Use the 'categories' and 'stores' state variables in your code as needed
  const [categories, setCategories] = useState<Record<string, any>[]>([]);
  const [stores, setStores] = useState<Record<string, any>[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResult = await fetch(
          `${process.env.BASE_URL}/api/getcategories?_=${new Date().getTime()}`,
          {
            cache: "no-cache",
          },
        );
        const storesResult = await fetch(
          `${process.env.BASE_URL}/api/getstores?_=${new Date().getTime()}`,
          {
            cache: "no-cache",
          },
        );
        const categoriesData = await categoriesResult.json();
        const storesData = await storesResult.json();
        setCategories(categoriesData.categories || []);
        setStores(storesData.stores || []);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  // Use the 'categories' and 'stores' state variables in your code as needed
  const form = useForm<InputType>({
    resolver: zodResolver(CreateUserCouponFormSchema),
    defaultValues: {
      title: "",
      coupon_code: "",
      description: "",
      ref_link: "",
      category_id: "",
      store_id: "",
      type: "Deal",
      due_date: undefined,
    },
    mode: "all",
  });

  const { control, handleSubmit, formState } = form;

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await axios.post("/createsubmittedcoupon", {
        ...data,
        store_id: Number(data.store_id),
        category_id: Number(data.category_id),
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
      });

      if (result.data.success) {
        toast({
          title: "Success",
          description: "Coupon submitted successfully",
        });
        form.reset();
        setDate(undefined);
      }
    } catch (err) {
      console.error(err);
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description: err?.response?.data?.error,
          variant: "destructive",
        });
      }
      toast({
        title: "Error",
        description: "Failed to submit coupon. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleFormSubmit}
          className="flex w-full flex-col space-y-4"
        >
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <sup className="text-app-main">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Coupon title"
                    {...field}
                    type="text"
                    className="rounded-lg !bg-app-bg-main dark:!bg-app-dark"
                  />
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
                  <Textarea
                    placeholder="Coupon Description"
                    {...field}
                    className="rounded-lg bg-app-bg-main dark:bg-app-dark"
                  />
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
                <FormLabel>
                  Reference Link<sup className="text-app-main">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    {...field}
                    type="url"
                    className="rounded-lg !bg-app-bg-main dark:!bg-app-dark"
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
              <FormItem className="w-full">
                <FormLabel>
                  Coupon Type<sup className="text-app-main">*</sup>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-lg !bg-app-bg-main dark:!bg-app-dark">
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

          {form.watch("type") === "Coupon" && (
            <FormField
              control={control}
              name="coupon_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
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
            name="category_id"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel>
                  Related Category<sup className="text-app-main">*</sup>
                </FormLabel>
                <Popover>
                  <PopoverTrigger
                    asChild
                    className="rounded-lg !bg-app-bg-main dark:!bg-app-dark"
                  >
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full",
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
                        if (
                          value.toLowerCase().includes(search.toLowerCase())
                        ) {
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
              <FormItem className="flex flex-col items-start gap-2">
                <FormLabel>
                  Related Store <sup className="text-app-main">*</sup>
                </FormLabel>
                <Popover>
                  <PopoverTrigger
                    asChild
                    className="rounded-lg !bg-app-bg-main dark:!bg-app-dark"
                  >
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full",
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
                        if (
                          value.toLowerCase().includes(search.toLowerCase())
                        ) {
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
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-1">
                <FormLabel>
                  Expiry Date<sup className="text-app-main">*</sup>
                </FormLabel>
                <Popover>
                  <PopoverTrigger
                    asChild
                    className="rounded-lg !bg-app-bg-main dark:!bg-app-dark"
                  >
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        {date ? (
                          format(date, "dd-MMM-yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown-buttons"
                      selected={date}
                      onSelect={(currentDate) => {
                        setDate(currentDate);
                        form.setValue("due_date", new Date(currentDate!));
                      }}
                      fromDate={new Date()}
                      toYear={date?.getFullYear()! + 10}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <p className="mt-2 place-self-center text-xs text-gray-400">
            Fields marked with<span className="text-app-main"> * </span>are
            required
          </p> */}
          <Button
            type="submit"
            size={"lg"}
            className="place-self-center rounded-lg"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? "Submitting" : "Submit"}
          </Button>
        </form>
      </Form>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-11/12 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this coupon?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-x-2 gap-y-4 lg:flex-row">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                handleSubmit(onSubmit)();
              }}
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? "Submitting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CreateUserCouponForm;
