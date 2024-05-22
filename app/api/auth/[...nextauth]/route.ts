import db from "@/lib/prisma";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

// these are the auth options to be passed to NextAuth
export const authOptions: AuthOptions = {
  // to specify the pages for signin and signout
  pages: {
    signIn: "/signin",
  },
  // to specify the providers for Authentication
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Johndoe123@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Your Password",
        },
      },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });
        // If no user is found, throw an error
        if (!user) throw new Error("Given Email is not Registered");

        // If no password is provided, throw an error
        if (!credentials?.password)
          throw new Error("Please Provide Your Password");
        const isPassowrdCorrect = await compare(
          credentials.password,
          user.password,
        );

        // If password is incorrect, throw an error
        if (!isPassowrdCorrect) throw new Error("Incorrect Password!");

        // // If user is not verified, throw an error
        // if (!user.emailVerified)
        //   throw new Error("Please verify your email first!");

        const { password, ...userWithoutPass } = user;
        return userWithoutPass;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // setting type of user to our database's user type in token
        token.user = user as User;
      }
      return token;
    },
    async session({ token, session }) {
      // returning session with user data from token
      session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
