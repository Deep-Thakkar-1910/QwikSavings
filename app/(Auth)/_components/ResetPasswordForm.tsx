"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ResetPasswordFormSchema } from "@/lib/FormSchemas/ResetPasswordFormSchema";
import { resetPassword } from "@/lib/Actions/AuthActions";
import Link from "next/link";
import { ToastAction } from "@/components/ui/toast";

type InputType = z.infer<typeof ResetPasswordFormSchema>;

// recieving the jwt token from the url
const ResetPasswordForm = ({ jwtUserId }: { jwtUserId: string }) => {
  const { ...form } = useForm<InputType>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  //   states for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await resetPassword(jwtUserId, data.password);
      if (result === "userDoesNotExist") {
        toast({
          title: "Uh oh!",
          description: "Something went wrong, please try again later.",
          variant: "destructive",
        });
      }
      if (result === "success") {
        toast({
          title: "Success",
          description: "Password reset successfully",
          action: (
            <ToastAction altText="sign In">
              <Link href={"/signin"}>Sign In</Link>
            </ToastAction>
          ),
        });
        form.reset();
      }
    } catch (err) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong, please try again later.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <sup className="text-app-main">*</sup>
                <FormControl>
                  <div className="flex items-center">
                    <Input
                      placeholder="Your Password"
                      {...field}
                      type={!showPassword ? "password" : "text"}
                      className="mr-2"
                      autoComplete="off"
                    />
                    <div
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                      }}
                    >
                      {!showPassword ? (
                        <Eye className="cursor-pointer" />
                      ) : (
                        <EyeOff className="cursor-pointer" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <sup className="text-app-main">*</sup>
                <FormControl>
                  <div className="flex items-center">
                    <Input
                      placeholder="Your Password"
                      {...field}
                      type={!showConfirmPassword ? "password" : "text"}
                      className="mr-2"
                      autoComplete="off"
                    />
                    <div
                      onClick={() => {
                        setShowConfirmPassword((prev) => !prev);
                      }}
                    >
                      {!showConfirmPassword ? (
                        <Eye className="cursor-pointer" />
                      ) : (
                        <EyeOff className="cursor-pointer" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full place-self-center rounded-lg hover:shadow-md"
          >
            {form.formState.isSubmitting ? "Reseting" : "Reset "}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
