"use client";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInFormSchema } from "@/lib/SignInFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";

interface SignInFormProps {
  callbackUrl?: string;
}

const SignInForm = ({ callbackUrl }: SignInFormProps) => {
  const router = useRouter();
  // This is the type of the form data
  type InputType = z.infer<typeof SignInFormSchema>;

  const { ...form } = useForm<InputType>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  // States to Toggle password visibilities.
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = async (data: InputType) => {
    const result = await signIn("credentials", {
      redirect: false,
      /*  
      spreading the email and password as credentials,
      as the keynames of form data is same as the keynames required by the authorize function.
      */
      ...data,
    });
    if (result?.ok) {
      router.push(callbackUrl || "/");
      form.reset();
    } else if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      if (result.error === "Given Email is not Registered") {
        // if error is related to email not found, then reset the form
        form.reset();
      } else if (result.error === "Incorrect Password!") {
        // if error is related to password, then reset the password field
        form.resetField("password");
      }
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
        {/* TODO: make forgot password work*/}
        <p className="cursor-pointer text-sm font-medium text-app-main underline sm:text-base">
          Forgot Password?
        </p>
        <Button
          type="submit"
          className="w-full place-self-center rounded-full hover:shadow-md"
        >
          {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
        <div className="mx-auto flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-gray-500 after:ml-4 after:block after:h-px after:flex-grow after:bg-gray-500">
          or
        </div>
        <Button className="w-full place-self-center rounded-full hover:shadow-md">
          Sign In with Google
        </Button>
      </form>
    </Form>
  );
};
export default SignInForm;
