import { type RoleName } from "@prisma/client";
import "next-auth";

export interface NextAuthUser {
  email: string;
  survey?: {
    id: number;
    name: string;
  };
  roles: RoleName[];
  accessTokenExpires: number;
}
