type ArtistQuery = {
  suggestions: {
    id: string,
    type: string,
    name: string,
    disambiguation: string
  }[]
}

type UserQuery = {
  suggestions: {
    id: string,
    username: string,
    createdAt: Date
    avatar: string
  }[]
}

type ReleaseQuery = {
  suggestions: {
    id: string,
    title: string,
    artistCredit : {
      joinphrase?: string
      name: string,
    }[] | null
    firstReleaseDate: string,
    primaryType: string
  }[]
}

type Suggestion = ArtistQuery | ReleaseQuery | UserQuery