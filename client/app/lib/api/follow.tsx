import axios from "axios"
import { ApiPageResponse, FollowersResponse } from "../types/api"

const API = process.env.NEXT_PUBLIC_API_URL

export const follow = async (profileId: string, token: string) => {
  await axios.post(`${API}/api/users/follow`, 
    { profileId }, 
    { headers : {
      Authorization: `Bearer ${token}`
    }}
  )
}

export const unfollow = async (profileId: string, token: string) => {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/unfollow`,
    {
      data: { profileId },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ); 
}

export const fetchFollowers = async (params: {
  profileId: string,
  page: number,
  userId: string | null | undefined,
  following: boolean
}) => {

  const { data } = await axios.get(`${API}/api/users/allFollowers`, {
    params
  })

  return data as ApiPageResponse<FollowersResponse>

}