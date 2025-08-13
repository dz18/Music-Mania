// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string | null;
      username: string | null;
      image?: string | null;
      id?: string | null;
      phoneNumber?: string | null;
      createdAt: Date | null;
      role: string;
    };
  }

  interface User {
    username?: string | null;
    id?: string | null;
    image?: string | null;
    id?: string | null;
    phoneNumber?: string | null;
    createdAt: Date | null;
    role: string;
  }
}