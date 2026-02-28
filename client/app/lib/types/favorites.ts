import { LikedArtist, LikedRelease, LikedSong } from "./profile"

export interface LikesResponse {
    userLikedArtist: LikedArtist[]
    userLikedRelease: LikedRelease[]
    userLikedSong: LikedSong[]
    _count: {
        userLikedArtist: number
        userLikedRelease: number
        userLikedSong: number
    }
}

export type LikeTabs = {
  label: string
  value: LikeTypes
  count: number
}[]

export type LikeTypes = 'artists' | 'releases' | 'songs'