"use server";

import { Prisma, User } from "@prisma/client";
import { hash } from "bcryptjs";
import * as z from "zod";
import db from "../prisma";
import { SignupValidationSchema } from "../SignupFormSchema";
// Server action for Regitsering users
// NOTE: The omit type is used to remove the fields that are not required for the backend
export const registerUser = async (
  userData: Omit<
    User,
    "id" | "emailVerified" | "createdAt" | "updatedAt" | "image"
  >,
) => {
  // extracting email and password from userData for backend validation
  const { email, password } = userData;

  // check if a user with given email already exists
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    throw new Error("User with this email already exists");
  }

  //   backend side validation for email and password
  const isEmailCorrect = SignupValidationSchema.emailSchema.safeParse(email);
  const isPasswordCorrect =
    SignupValidationSchema.passwordSchema.safeParse(password);
  try {
    if (!isEmailCorrect.success) {
      throw new Error("Invalid email address");
    }

    if (!isPasswordCorrect.success) {
      throw new Error("Invalid password");
    }

    const result = await db.user.create({
      data: {
        ...userData,
        email,
        password: await hash(userData.password, 11),
      },
    });
    return result;
  } catch (err) {
    return err;
  }
};
