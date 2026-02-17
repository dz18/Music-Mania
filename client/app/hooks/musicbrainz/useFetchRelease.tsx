import { ApiPageResponse, Release, ReviewResponse } from "@/app/lib/types/api"
import axios, { AxiosError } from "axios"
import { useCallback, useEffect, useState } from "react"

export default function useFetchRelease (releaseId: string, star: number | null) {

  const [coverArt, setCoverArt] = useState('')
  const [release, setRelease] = useState<Release | null>(null)
  const [releaseLoad, setReleaseLoad] = useState(false)
  const [starStats, setStarStats] = useState<StarCount[]>([])
  const [error, setError] = useState<string | null>(null)

  const [data, setData] = useState<ApiPageResponse<ReviewResponse> | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async (page: number) => {
    try {
      setLoading(true)
      
      const requests = []
      if (!release) {
        setReleaseLoad(true)
        requests.push(
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getRelease`, {
            params: {releaseId: releaseId}
          })
        )
      }

      requests.push(
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/release`,{
          params: {id: releaseId, page: page, star: star}
        })
      )
      
      const results = await Promise.all(requests)
      let index = 0
      if (!release) {
        const releaseResult = results[index]
        index++

        setCoverArt(releaseResult.data.coverArtUrl)
        setRelease(releaseResult.data.album)
      }

      const reviewResults = results[index]
      setData(reviewResults.data)
      setStarStats(reviewResults.data.data.starStats)
      setError(null)
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
      setReleaseLoad(false)
    }
  }, [releaseId, star])
    
  useEffect(() => {
    fetchData(1)
  }, [fetchData])

  return {
    coverArt,
    release,
    loading,
    fetchData,
    error,
    data,
    setData,
    releaseLoad,
    starStats,
    setStarStats
  }
}