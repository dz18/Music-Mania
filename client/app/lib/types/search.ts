type ArtistQuery = {
  id: string,
  type: string,
  name: string,
  disambiguation: string
}

type UserQuery = {
  id: string,
  username: string,
  createdAt: Date
}

type ReleaseQuery = {
  id: string,
  title: string,
  'artist-credit' : {
    joinphrase?: string
    name: string,
  }[] | null
  type: string
  'first-release-date': string,
}