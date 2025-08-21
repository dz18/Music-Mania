// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string | null;
      username: string | null;
      avatar?: string | null;
      id?: string | null
      phoneNumber?: string | null
      favArtists?: string[] | null
    };
  }

  interface User {
    username?: string | null;
    id?: string | null
  }
}