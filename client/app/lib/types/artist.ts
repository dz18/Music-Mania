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