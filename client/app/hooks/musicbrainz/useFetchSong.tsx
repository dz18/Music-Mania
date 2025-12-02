import { ApiPageResponse, ReviewResponse } from "@/app/lib/types/api"
import { Song } from "@/app/lib/types/song"
import axios, { AxiosError } from "axios"
import { request } from "http"
import { useCallback, useEffect, useState } from "react"

export default function useFetchSong (songId: string, star: number | null) {

  const [song, setSong] = useState<Song | null>(null)
  const [songLoad, setSongLoad] = useState(false)
  
  const [coverArt, setCoverArt] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [data, setData] = useState<ApiPageResponse<ReviewResponse> | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async (page: number) => {
    try {
      setLoading(true)

      const requests = []
      if (!song) {
        setSongLoad(true)
        requests.push(      
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getSong`, {
            params: { songId: songId }
          })
        )
      } 

      requests.push(
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/song`,{
          params: { id: songId, page: page, star: star }
        })
      )

      const results = await Promise.all(requests)
      let index = 0
      if (!song) {
        const songResults = results[index]
        index++

        setCoverArt(songResults.data.coverArtUrl)
        setSong(songResults.data.song)
      }

      const reviewResults = results[index]
      setData(reviewResults.data)

    } catch (error) {
      const err = error as AxiosError<{error: string}>
      console.error("Review fetch failed", err.response?.data.error)
      setError(err.response?.data.error ?? err.message)
    } finally {
      setLoading(false)
      setSongLoad(false)
    }
  }, [songId, star])

  useEffect(() => {
    fetchData(1)
  }, [fetchData])

  return {
    song,
    songLoad,
    coverArt,
    data,
    loading,
    setData,
    fetchData,
    error
  }

}