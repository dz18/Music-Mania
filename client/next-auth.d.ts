// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string | null;
      username: string | null;
      // avatar?: string | null;
      id: string | null
      createdAt: Date | null
      token: any
    };
  }

  interface User {
    username?: string | null;
    rawToken: string
    id?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string | null
    email: string | null
    avatar: string | null
    createdAt: Date | null
    raw: string | null
  }
}