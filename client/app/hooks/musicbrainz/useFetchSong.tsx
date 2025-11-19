import { ApiPageResponse, ReviewResponse } from "@/app/lib/types/api"
import { Song } from "@/app/lib/types/song"
import axios, { AxiosError } from "axios"
import { useCallback, useEffect, useState } from "react"

export default function useFetchSong (songId: string) {

  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(false)
  const [coverArt, setCoverArt] = useState('')
  const [reviews, setReviews] = useState<ReviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [data, setData] = useState<ApiPageResponse<ReviewResponse> | null>(null)

  const fetchData = useCallback(async (page: number) => {
    try {
      setLoading(true)
      const [songResult, reviews] = await  Promise.allSettled([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getSong`, {
          params: { songId }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/song`,{
          params: { id: songId, page: page }
        })
      ])

      if (songResult.status === 'fulfilled') {
        setSong(songResult.value.data.song)
        setCoverArt(songResult.value.data.coverArtUrl)
      } else {
        const error = songResult.reason as AxiosError<{error: string}>
        console.error("Song fetch failed", error.response?.data.error)
        setError(error.response?.data.error ?? error.message)
      }

      if (reviews.status === 'fulfilled') {
        setData(reviews.value.data)
      } else {
        const error = reviews.reason as AxiosError<{error: string}>
        console.error("Review fetch failed", error.response?.data.error)
        setError(error.response?.data.error ?? error.message)
      }

    } catch (error) {
      const err = error as AxiosError<{error: string}>
      console.error("Review fetch failed", err.response?.data.error)
      setError(err.response?.data.error ?? err.message)
    } finally {
      setLoading(false)
    }
  }, [songId])

  useEffect(() => {
    fetchData(1)
  }, [fetchData])

  return {
    song,
    loading,
    coverArt,
    data,
    setData,
    fetchData,
    error
  }

}