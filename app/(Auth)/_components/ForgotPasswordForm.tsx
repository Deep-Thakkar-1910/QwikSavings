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
import { ForgotPasswordFormSchema } from "@/lib/FormSchemas/ForgotPasswordFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { forgotPassword } from "@/lib/Actions/AuthActions";
import { toast } from "@/components/ui/use-toast";

// This is the type of forgot password form data
type InputType = z.infer<typeof ForgotPasswordFormSchema>;

const ForgotPasswordForm = () => {
  const { ...form } = useForm<InputType>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
    mode: "all",
  });

  //   This function will be called when the form is submitted
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const result = await forgotPassword(data.email);
    if (result === "userDoesNotExist") {
      toast({
        title: "Uh Oh!",
        description: "Given Email is not Registered",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Email sent to your registered email address.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <sup className="text-app-main">*</sup>
              <FormControl>
                <Input placeholder="JohnDoe@gmail.com" {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full place-self-center rounded-lg hover:shadow-md"
          disabled={form.formState.isSubmitting}
        >
          Confirm
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
