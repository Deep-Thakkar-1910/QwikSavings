"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignUpFormSchema } from "@/lib/FormSchemas/SignupFormSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { registerUser } from "@/lib/Actions/AuthActions";
import { toast } from "@/components/ui/use-toast";
import GoogleIcon from "@/public/Logos/GoogleIcon";
import { signIn } from "next-auth/react";
import { ToastAction } from "@radix-ui/react-toast";
import Link from "next/link";

// This is the type of the form data
type InputType = z.infer<typeof SignUpFormSchema>;

const SignUpForm = () => {
  const { ...form } = useForm<InputType>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  //   This function will be called when the form is submitted
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const { confirmPassword, ...userData } = data;
    try {
      const result = await registerUser(userData);
      if (typeof result !== "string") {
        form.reset();
        toast({
          title: "Success",
          description: "Account Creaeted Successfully",
          action: (
            <ToastAction altText="sign In">
              <Link href={"/signin"}>Sign In</Link>
            </ToastAction>
          ),
        });
      } else if (result === "This Email is already registered") {
        toast({
          title: "Uh oh!",
          description: "This email is already registered",
          action: (
            <ToastAction altText="sign In">
              <Link href={"/signin"}>Sign In Instead?</Link>
            </ToastAction>
          ),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  // States to Toggle password visibilities.
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <p className="mt-2 place-self-center text-xs text-gray-400">
          Fields marked with<span className="text-app-main"> * </span>are
          required
        </p>
        <Button
          type="submit"
          className="w-full place-self-center rounded-lg hover:shadow-md"
        >
          {form.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
        </Button>
        <div className="mx-auto flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-gray-500 after:ml-4 after:block after:h-px after:flex-grow after:bg-gray-500">
          or
        </div>
        <Button
          type="button"
          className="flex w-full items-center gap-x-4 place-self-center rounded-lg bg-slate-100 text-black hover:bg-white hover:shadow-md dark:bg-app-dark dark:text-slate-200 dark:hover:bg-zinc-950"
          onClick={() => signIn("google")}
        >
          Sign In with Google
          <GoogleIcon />
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
