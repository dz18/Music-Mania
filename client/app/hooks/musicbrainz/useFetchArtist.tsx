import { ApiPageResponse, ReviewResponse } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useFetchArtist (artistId: string, star: number | null) {
  
  const [reviewsload, setReviewsLoad] = useState(false)
  const [starStats, setStarStats] = useState<StarCount[]>([])
  const [artist, setArtist] = useState<Artist | null>(null)
  const [artistLoad, setArtistLoad] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ApiPageResponse<ReviewResponse> | null>(null)

  const fetchData = useCallback(async (page: number) => {
    try {
      setData(null)
      setError(null)
      setReviewsLoad(true)

      const requests = []
      if (!artist) {
        setArtistLoad(true)
        requests.push(
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
            params : {id : artistId}
          })
        )
      }

      requests.push(
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/artist`, {
          params: { id: artistId, page: page, star: star }
        })
      )

      const results = await Promise.allSettled(requests)
      let index = 0

      if (!artist) {
        const artistResult = results[index]
        index++

        if (artistResult.status === "fulfilled") {
          setArtist(artistResult.value.data)
        } else {
          const error = artistResult.reason as AxiosError<{ error: string }>
          console.error("Artist fetch failed", error.response?.data.error)
          setError(error.response?.data.error ?? error.message)
        }
      }

      const reviewsResult = results[index]

      if (reviewsResult.status === "fulfilled") {
        const res = reviewsResult.value.data
        if (!data) {
          setStarStats(res.data.starStats)
          setData(res)
        }
        else {
          setData(prev => {
            if (!prev) return res

            return {
              count: res.count,
              data: {
                ...prev.data,
                reviews: res.data.reviews
              },
              pages: res.pages,
              currentPage: res.currentPage,
              limit: res.limit
            }
          })
        }
      } else {
        const error = reviewsResult.reason as AxiosError<{ error: string }>
        console.error("Review fetch failed", error.response?.data.error ?? error.message)
        setError(error.response?.data.error ?? error.message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setReviewsLoad(false)
      setArtistLoad(false)
    }
  }, [artistId, star])

  useEffect(() => {
    fetchData(1)
  }, [fetchData])

  return { artist, reviewsload, artistLoad, fetchData, setArtist, error, data, setData, starStats, setStarStats }

}