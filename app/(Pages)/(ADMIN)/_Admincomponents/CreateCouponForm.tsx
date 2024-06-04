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
import { CalendarIcon, CheckIcon } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import { cn } from "@/lib/utils";
import { useState } from "react";
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

type InputType = z.infer<typeof CreateCouponFormSchema>;

interface CouponFormProps {
  categories: { name: string; categoryId: number }[];
  stores: { name: string; storeId: number }[];
}

const CreateCouponForm = ({ categories, stores }: CouponFormProps) => {
  // date picker state
  const [date, setDate] = useState<Date | undefined>(new Date());
  const form = useForm<InputType>({
    resolver: zodResolver(CreateCouponFormSchema),
    defaultValues: {
      title: "",
      coupon_code: "",
      description: "",
      ref_link: "",
      type: "Deal",
      due_date: undefined,
    },
    mode: "all",
    shouldFocusError: true,
  });

  const { control, handleSubmit, formState } = form;
  // form submission handler
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await axios.post(
        "/createcoupon",
        { body: JSON.stringify(data) },
        { headers: { "Content-Type": "application/json" } },
      );

      if (result.data.success) {
        toast({
          title: "Success",
          description: "Coupon created successfully",
        });
        form.reset();
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
                  <SelectItem value="Offer">Offer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.getValues("type") === "Offer" && (
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
                      placeholder="Select a Category..."
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
