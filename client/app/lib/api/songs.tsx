import axios from "axios"
import { ApiPageResponse, ReviewResponse } from "../types/api"
import { getSongResult } from "../types/release"

const API = process.env.NEXT_PUBLIC_API_URL

export const getSong = async (
  songId: string,
) => {
  
  const { data } = await axios.get<getSongResult>(`${API}/api/musicbrainz/getSong`, {
    params: { songId }
  })

  return data

}

export const songReviewsQuery = async (
  params : {
    songId: string,
    workId: string | null | undefined,
    star: string | null,
    page: number
  }
) => {

  const { data } = await axios.get<ApiPageResponse<ReviewResponse>>(`${API}/api/reviews/song`,{
    params
  })

  return data

} 