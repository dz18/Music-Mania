export interface FavoritesResponse {
    favArtists: FavArtist[]
    favReleases: FavRelease[]
    favSongs: FavSong[]
    _count: {
        favArtists: number
        favReleases: number
        favSongs: number
    }
}

export type FavoriteTabs = {
  label: string
  value: FavoriteTypes
  count: number
}[]

export type FavoriteTypes = 'artists' | 'releases' | 'songs'