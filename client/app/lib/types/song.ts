
interface Song {
  "artist-credit" : ArtistCredit[]
  disambiguation: string
  "first-release-date": string
  genres: Genre[]
  id: string
  length: number
  relations: Relation[]
  title: string
  video: boolean
  releases: Release[]
}

interface ArtistCredit {
    artist: Artist
    joinphrase: string
    name: string
}

interface Relation {
  artist: Artist
  "attribute-ids": object
  "attribute-values": object
  attributes: string[]
  begin: string
  direction: string
  end: string
  ended: boolean
  "source-credit": string
  "target-credit": string
  "target-type": string
  type: string
  "type-id": string
}

interface Artist {
  country: string
  disambiguation: string
  genres: Genre[]
  id: string
  name: string
  "sort-name": string
  type: string
  "type-id": string
}

interface Genre {
  count: number
  disambiguation: string
  id: string
  name: string
}

interface Release {
  "artist-credit": ArtistCredit[]
  barcode: string
  country: string
  date: string
  disambiguation: string
  genres: Genre[]
  id: string
  packaging: string
  "packaging-id": string
  quality: string
  "release-group": ReleaseGroup
}

interface ReleaseGroup {
  "artist-credit": ArtistCredit[]
  disambiguation: string
  genres: Genre[]
  id: string
  "primary-type": string
  "primary-type-id": string
  "secondary-types": string[]
  "secondary-type-ids": string[]
  title: string
}