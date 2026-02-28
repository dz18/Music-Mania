import axios from "axios"
import { ApiPageResponse, ReviewResponse } from "../types/api"
import { getReleaseResult } from "../types/release"

export const getRelease = async (
  releaseId: string,
) => {
  
  const { data } = await axios.get<getReleaseResult>(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getRelease`, {
    params: {releaseId: releaseId}
  })

  return data

}

export const releaseReviewsQuery = async (
  params : {
    id: string,
    star: string | null,
    page: number
  }
) => {

  const { data } = await axios.get<ApiPageResponse<ReviewResponse>>(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/release`,{
    params
  })

  return data

}