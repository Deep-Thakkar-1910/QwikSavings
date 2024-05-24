import db from "@/lib/prisma";
import { User } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// these are the auth options to be passed to NextAuth
export const authOptions: AuthOptions = {
  // database adapter
  adapter: PrismaAdapter(db),

  // to specify the pages for signin and signout
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },

  // specifying the session strategy
  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET!,
  },

  // to specify the providers for Authentication
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
          user.password!,
        );

        // If password is incorrect, throw an error
        if (!isPassowrdCorrect) throw new Error("Incorrect Password!");

        // If user is not verified, throw an error
        if (!user.emailVerified)
          throw new Error("Please verify your email first!");

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
