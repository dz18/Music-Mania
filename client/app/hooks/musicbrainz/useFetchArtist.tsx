import { ApiPageResponse, ReviewResponse } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useFetchArtist (artistId: string) {
  
  const [loading, setLoading] = useState(false)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ApiPageResponse<ReviewResponse> | null>(null)

  const fetchData = useCallback(async (page: number) => {
    try {
      setLoading(true)
      setError(null)

      const requests = []
      if (!artist) {
        requests.push(
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
            params : {id : artistId}
          })
        )
      }

      requests.push(
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/artist`, {
          params: { id: artistId, page: page }
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
        setData(res)
      } else {
        const error = reviewsResult.reason as AxiosError<{ error: string }>
        console.error("Review fetch failed", error.response?.data.error)
        setError(error.response?.data.error ?? error.message)
      }
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }, [])

  // const fetchData = useCallback(async () => {
  //   try {
  //     setLoading(true)
  //     setError(null)

  //     const [artist, reviews] = await Promise.allSettled([
  //       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
  //         params : {id : artistId}
  //       }),
  //       axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/artist`, {
  //         params: {id: artistId}
  //       })
  //     ])

  //     if (artist.status === "fulfilled") {
  //       setArtist(artist.value.data)
  //     } else {
  //       const error = artist.reason as AxiosError<{error: string}>
  //       console.error("Artist fetch failed", error.response?.data.error)
  //       setError(error.response?.data.error ?? error.message)
  //     }

  //     if (reviews.status === "fulfilled") {
  //       setReviews(reviews.value.data)
  //     } else {
  //       const error = reviews.reason as AxiosError<{error: string}>
  //       console.error("Review fetch failed", error.response?.data.error)
  //       setError(error.response?.data.error ?? error.message)
  //     }

  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [artistId])

  useEffect(() => {
    fetchData(1)
  }, [fetchData])

  return { artist, loading, fetchData, setArtist, error, data, setData }

}