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
      createdAt: Date | null
      favArtists?: userFavArtist[] | null
      favSongs?: userFavSong[] | null
      favReleases?: userFavRelease[] | null
      token: any
    };
  }

  interface User {
    username?: string | null;
    rawToken: string
    id?: string | null
  }
}