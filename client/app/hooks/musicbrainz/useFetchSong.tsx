import { ApiPageResponse, ReviewResponse } from "@/app/lib/types/api"
import { Song } from "@/app/lib/types/song"
import axios, { AxiosError } from "axios"
import { useCallback, useEffect, useState } from "react"

export default function useFetchSong (songId: string, star: number | null) {

  const [song, setSong] = useState<Song | null>(null)
  const [songLoad, setSongLoad] = useState(false)
  const [starStats, setStarStats] = useState<StarCount[]>([])
  
  const [coverArt, setCoverArt] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [data, setData] = useState<ApiPageResponse<ReviewResponse> | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async (page: number) => {
    try {
      setLoading(true)

      setData(null)
      let currentSong = song

      // Fetch only if not already loaded
      if (!currentSong) {
        setSongLoad(true)

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getSong`,
          { params: { songId } }
        )

        currentSong = data.song
        setCoverArt(data.coverArtUrl)
        setSong(data.song)
      }

      const workId = currentSong &&
        "workId" in currentSong
          ? `${currentSong.workId}`
          : `${songId}`

      const { data: reviewRes } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/song`, {
          params: { songId, page, star, workId },
        }
      )

      setData(reviewRes)
      setStarStats(reviewRes.data.starStats)

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
    error,
    starStats,
    setStarStats
  }

}