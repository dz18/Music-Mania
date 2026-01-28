import { ApiPageResponse, ReviewResponse } from "@/app/lib/types/api"
import { Song } from "@/app/lib/types/song"
import axios, { AxiosError } from "axios"
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

      let songRes
      if (!song) {
        setSongLoad(true)
        const songDetails = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getSong`, {
          params: { songId: songId }
        })
        songRes = songDetails.data
        console.log(songRes)
      } 

      if (!song) {
        setCoverArt(songRes.coverArtUrl)
        setSong(songRes.song)
      }

      const workId = ('workId' in songRes.song) ? 
        `${songRes.song.workId}` : `${songId}`

      const songReviews = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/song`,{
        params: { songId: songId, page: page, star: star, workId: workId }
      })

      const reviewResults = songReviews.data
      setData(reviewResults)

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