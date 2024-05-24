"use server";

import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import db from "../prisma";
import { compileEmailTemplate, sendmail } from "../Mail";
import { signJwt, verifyJwt } from "../JwtEncryption/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Server action for Regitsering users
// NOTE: The omit type is used to remove the fields that are not required for the backend
export const registerUser = async (
  userData: Omit<
    User,
    "id" | "emailVerified" | "createdAt" | "updatedAt" | "image" | "role"
  >,
) => {
  try {
    const newUser = await db.user.create({
      data: {
        ...userData,
        password: await hash(userData.password!, 11),
      },
    });

    // generating the verification URL and email for the new user
    const jwtUserId = signJwt({ userId: newUser.id });
    // using the encrypted token as verification url
    const activationUrl = `${process.env.NEXTAUTH_URL}/verification/${jwtUserId}`;
    const htmlBody = await compileEmailTemplate(
      newUser.name,
      `${activationUrl}`,
      "Verification",
    );

    // sending the actual mail to user for activation
    await sendmail({
      to: newUser.email,
      subject: "Verify your email",
      body: htmlBody,
    });

    // returning the newly created user without password
    return newUser;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // if the email already exists
      if (err.code === "P2002") {
        return "This Email is already registered";
      }
    }
  }
};

// defining return types of the verifyUser function
type VerifyUserFunction = (
  jwtUserId: string,
) => Promise<"userDoesNotExist" | "userAlreadyVerified" | "success">;

// Server action for verifying users
export const verifyUser: VerifyUserFunction = async (jwtUserId: string) => {
  const payload = verifyJwt(jwtUserId);
  const userId = payload?.userId;

  const user = await db.user.findUnique({ where: { id: userId } });

  // if user does not exist
  if (!user) return "userDoesNotExist";

  // if user is already verified
  if (user.emailVerified) return "userAlreadyVerified";

  // updating the user with emailVerified field
  await db.user.update({
    where: { id: userId },
    data: {
      emailVerified: new Date(),
    },
  });
  return "success";
};

// defining return types of the forgotPassword function
type ForgotPasswordFunction = (
  email: string,
) => Promise<"userDoesNotExist" | "success">;

// Server action for forgot password
// NOTE: The Function is called inside (Auth)/_components/ForgotPasswordForm.tsx
export const forgotPassword: ForgotPasswordFunction = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  // if user does not exist
  if (!user) return "userDoesNotExist";

  // generating the Reset URL and email for the new user
  const jwtUserId = signJwt({ id: user.id }, { expiresIn: "2h" });
  // using the encrypted token as resetPass url
  const resetPassUrl = `${process.env.NEXTAUTH_URL}/resetpassword/${jwtUserId}`;

  // generating the email body
  const htmlBody = await compileEmailTemplate(
    user.name,
    `${resetPassUrl}`,
    "Forgot",
  );

  // sending the actual mail to user for reset password
  await sendmail({
    to: user.email,
    subject: "Reset Your Password",
    body: htmlBody,
  });

  return "success";
};

// defining return types of the resetPassword function
type ResetPasswordFunction = (
  jwtUserId: string,
  newPassword: string,
) => Promise<"userDoesNotExist" | "success">;

// Server action for reset password
// NOTE: The Function is called inside (Auth)/_components/ResetPasswordForm.tsx
export const resetPassword: ResetPasswordFunction = async (
  jwtUserId: string,
  newPassword: string,
) => {
  const payload = verifyJwt(jwtUserId);
  const userId = payload?.id;
  const user = await db.user.findUnique({ where: { id: userId } });

  // if user does not exist
  if (!user) return "userDoesNotExist";

  // updating the user with new password
  await db.user.update({
    where: { id: userId },
    data: {
      password: await hash(newPassword, 11),
    },
  });
  return "success";
};
