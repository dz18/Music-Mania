import { ReviewKind } from "@/app/lib/types/reviews";
import axios from "axios";
import { ArtistCredit } from "../types/api";

const API = process.env.NEXT_PUBLIC_API_URL

export const getItemsTotalLikes = async (
  
) => {
  
}

export const checkUserLike = async (
  params: {
    itemId: string, type: ReviewKind
  },
  token: string
) => {
  const { data } = await axios.get(`${API}/api/users/like`, { 
    params,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return data
}

export const likeItem = async (
  body: {
    itemId: string,
    type: ReviewKind,
    name: string | null,
    title: string | null,
    artistCredit: ArtistCredit[] | null,
    coverArt: string | null
  },
  token: string
) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/like`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return data
}

export const deleteLikedItem = async (
  data: {
    itemId: string,
    type: ReviewKind
  },
  token: string
) => {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/like`, {
    data,
    headers : {
      Authorization: `Bearer ${token}`
    }
  })
}