import "next-auth";

export interface NextAuthUser {
  email: string;
  survey?: {
    id: number;
    name: string;
  };
}
