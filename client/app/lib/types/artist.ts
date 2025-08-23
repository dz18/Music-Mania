import { User } from "./users"

export type Release = {
  type: string,
  id: string,
  releaseDate: string,
  disambiguation: string,
  title: string,
}

export type Artist = {
  id: string
  gender: string,
  name: string,
  lifeSpan: {
    begin: string,
    end: string,
    ended: boolean
  },
  beginArea: {
    disambiguation: string
    name: string,
    id: string
  }
  endArea: {}
  type: string,
  country: string,
  disambiguation: string,
  // relations: string
  genres: {
    name: string
    disambiguation: string
    id: string
  }[]
  aliases: {
    name: string
    type: string
  }[]
  membersOfband: {
    lifeSpan: {
      begin: string,
      end: string,
      ended: boolean
    },
    artist: {
      type: string,
      id: string,
      name: string,
      country: string,
      disambiguation: string
    }
  }[],
  urls : {
    url: string,
    type: string
  }[]
}

export type Review = {
  id: string,
  userId: string,
  type: 'ARTIST' | 'RECORDING' | 'RELEASE',
  itemId: string
  rating: number,
  comment: string
  createAt: Date
  updatedAt: Date
  status: 'DRAFT' | 'PUBLISHED',
  user: User
}