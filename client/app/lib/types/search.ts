type ArtistQuery = {
  id: string,
  type: string,
  name: string,
  disambiguation: string
}

type RecordingQuery = {
  id: string,
  title: string,
  length: string | null
  artistCredit : {
    joinphrase?: string
    name: string,
  }[] | null
  firstReleaseDate: string | null
  disambiguation: string | null
}

type ReleaseQuery = {
  id: string,
  title: string,
  artistCredit : {
    joinphrase?: string
    name: string,
  }[] | null
  type: string
  date: string,
}