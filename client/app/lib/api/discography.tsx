import axios from "axios"
import { DiscographyResponse, DiscographyType } from "../types/discography"
 
const API = process.env.NEXT_PUBLIC_API_URL
 
export const getArtist = async (
  artistId: string
) => {
  const { data } = await axios.get(`${API}/api/musicbrainz/getArtist`, {
    params: { id: artistId }
  })
  return data
}
 
export const getDiscography = async (
  artistId: string,
  active: DiscographyType,
  page: number
) => {
  if (active === 'single') {
    const { data } = await axios.get<DiscographyResponse>(`${API}/api/musicbrainz/discographySingles`, {
      params: { artistId, type: active, page }
    })
    return data
  } else {
    const { data } = await axios.get<DiscographyResponse>(`${API}/api/musicbrainz/discography`, {
      params: { artistId, type: active, page }
    })
    return data
  }

}