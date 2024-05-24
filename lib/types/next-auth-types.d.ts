import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: Omit<User, "password">;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: Omit<User, "password">;
  }
}
