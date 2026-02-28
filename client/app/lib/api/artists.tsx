import axios from "axios"
import { Artist } from "../types/artist"
import { ApiPageResponse, ReviewResponse } from "../types/api"

const API = process.env.NEXT_PUBLIC_API_URL

export const getArtist = async (
  params: {
    id: string
  }
) => {

  const { data } = await axios.get<Artist>(`${API}/api/musicbrainz/getArtist`, 
    { params }
  )
  return data

}

export const artistReviewsQuery = async (
  params: {
    id: string, 
    star: string | null, 
    page: number
  }
) => {

  const { data } = await axios.get<ApiPageResponse<ReviewResponse>>(`${API}/api/reviews/artist`, { params })

  return data
}