import type { AdminRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AdminRole;
    } & DefaultSession["user"];
    adminSessionExpiresAt?: number;
  }

  interface User {
    role: AdminRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AdminRole;
    adminSessionIssuedAt?: number;
    adminSessionExpiresAt?: number;
    adminSessionMaxAgeHours?: number;
  }
}
