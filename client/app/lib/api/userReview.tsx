import axios from "axios"
import { ReviewKind, ReviewTypeMap, SaveReviewInput, UserArtistReview, UserReleaseReview, UserSongReview } from "../types/reviews"

const API = process.env.NEXT_PUBLIC_API_URL

export const getUserReview = async <
  T extends ReviewKind
> (
  params: {
    itemId: string | undefined, 
    type: T
  },
  token: string | null | undefined
): Promise<ReviewTypeMap[T]> => {

  const { data } = await axios.get<ReviewTypeMap[T]>(`${API}/api/users/review`, { 
    params,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return data

}

export const saveReview = async (
  body: SaveReviewInput,
  token: string | null
) => {
  
  const { data } = await axios.put(`${API}/api/reviews`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return data

}

export const deleteReview = async (
  params: {
    itemId: string | undefined,
    type: "artist" | "release" | "song"
  },
  token: string
) => {
  return await axios.delete(`${API}/api/reviews`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  })

}