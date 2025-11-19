import { ApiPageResponse, Release, ReviewResponse } from "@/app/lib/types/api"
import axios, { AxiosError } from "axios"
import { useCallback, useEffect, useState } from "react"

export default function useFetchRelease (releaseId: string) {

  const [coverArt, setCoverArt] = useState('')
  const [album, setAlbum] = useState<Release | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [data, setData] = useState<ApiPageResponse<ReviewResponse> | null>(null)

  const fetchData = useCallback(async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      
      const [album, reviews] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getRelease`, {
          params: {releaseId: releaseId}
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/release`,{
          params: {id: releaseId, page: page}
        })
      ])
      setCoverArt(album.data.coverArtUrl)
      setAlbum(album.data.album)
      setData(reviews.data)
    } catch (error : any) {
      const err = error as AxiosError<{ error: string }>

      console.error(error)

      setError(
        err.response?.data?.error ??
        err.message ??
        "Unknown error occurred"
      )
    } finally {
      setLoading(false)
    }
  }, [releaseId])
    
  useEffect(() => {
    fetchData(1)
  }, [fetchData])

  return {
    coverArt,
    album,
    loading,
    fetchData,
    error,
    data,
    setData
  }
}