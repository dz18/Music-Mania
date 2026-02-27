import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL

export const getSearchResults = async (
  params: {
    q: string,
    page: number,
    type?: string | null
  },
  selectedTab: string
) => {
  let res
  if (selectedTab === 'artists' || selectedTab === 'releases') {
    res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/${selectedTab}`, {
      params
    })
  } else if (selectedTab === 'users') {
    res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/query`, {
      params: { q: params.q, page: params.page }
    })
  } else {
    throw new Error('Unknown Type')
  }

  return res.data
}