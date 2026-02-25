import axios from "axios"
import { ApiPageResponse } from "../types/api"
import { ProfileArtistReview, ProfileReleaseReview, ProfileSongReview, TabKeys, UserProfile } from "../types/profile"
import { LikesResponse, LikeTypes } from "../types/favorites"

const API = process.env.NEXT_PUBLIC_API_URL

export const fetchProfile = async (
  profileId: string,
  token: string | null | undefined
) => {

  const { data } = await axios.get<UserProfile>(`${API}/api/users/profile`, {
    params : { profileId },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return data

}

export const fetchTab = async <T extends TabKeys>(
  tab: T, 
  params: {
    profileId: string,
    page: number,
    star: string | null
  },
) => {
  switch (tab) {
    case "artistReviews":
      return axios
        .get<ApiPageResponse<ProfileArtistReview>>(`${API}/api/reviews/user/artists`, { params })
        .then(res => res.data);
    case "releaseReviews":
      return axios
        .get<ApiPageResponse<ProfileReleaseReview>>(`${API}/api/reviews/user/releases`, { params })
        .then(res => res.data);
    case "songReviews":
      return axios
        .get<ApiPageResponse<ProfileSongReview>>(`${API}/api/reviews/user/songs`, { params })
        .then(res => res.data);
    default:
      throw new Error("Invalid tab");
  }
}

export const fetchUserArtistReviews = async (  
  params: {
    profileId: string,
    page: number,
    star: string | null
  }
) => {
  return axios
    .get<ApiPageResponse<ProfileArtistReview>>(`${API}/api/reviews/user/artists`, { params })
    .then(res => res.data)
}

export const fetchUserReleaseReviews = async (
  params: {
    profileId: string,
    page: number,
    star: string | null
  }
) => {
  return axios
    .get<ApiPageResponse<ProfileReleaseReview>>(`${API}/api/reviews/user/releases`, { params })
    .then(res => res.data)
}

export const fetchUserSongReviews = async (
  params: {
    profileId: string,
    page: number,
    star: string | null
  }
) => {
  return axios
    .get<ApiPageResponse<ProfileSongReview>>(`${API}/api/reviews/user/songs`, { params })
    .then(res => res.data)
}

export const fetchLikes = async (profileId: string, active: LikeTypes) => {
  const res = await axios.get<LikesResponse>(`${API}/api/users/likes`, {
    params: { id: profileId, active }
  })
  return res.data
}