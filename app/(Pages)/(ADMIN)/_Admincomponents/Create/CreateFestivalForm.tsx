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
import { CreateFestivalFormSchema } from "@/lib/FormSchemas/CreateFestivalFormSchema";
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
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";

type InputType = z.infer<typeof CreateFestivalFormSchema>;

const CreateFestivalForm = () => {
  const [stores, setStores] = useState<{ name: string; storeId: string }[]>([]);
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("/getstores");
        if (response.data.success) {
          setStores(response.data.stores);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStores();
  }, []);
  // decalring the form object
  const form = useForm<InputType>({
    resolver: zodResolver(CreateFestivalFormSchema),
    defaultValues: {
      name: "",
      store_id: "",
      title: "",
    },
    mode: "all",
    shouldFocusError: true,
  });

  const { control, handleSubmit, formState } = form;

  // form submission handler
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await axios.post("/createfestival", JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (result.data.success) {
        toast({
          title: "Success",
          description: "Festival Created Successfully",
        });
        form.reset();
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
              <FormLabel>Festival Name</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Input
                  placeholder="Enter a Festival Name"
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Festival Title</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Input
                  placeholder="Enter a Festival Name"
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
        <p className="mt-2 place-self-center text-xs text-gray-400">
          Fields marked with<span className="text-app-main"> * </span>are
          required
        </p>

        <Button
          type="submit"
          className="w-full place-self-center rounded-lg hover:shadow-md"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? "Creating..." : "Create Festival"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateFestivalForm;
