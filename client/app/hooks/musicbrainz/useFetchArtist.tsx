import { ReviewResponse } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useFetchArtist (artistId: string) {
  
  const [loading, setLoading] = useState(false)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [reviews, setReviews] = useState<ReviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [artist, reviews] = await Promise.allSettled([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
          params : {id : artistId}
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/artist`, {
          params: {id: artistId}
        })
      ])

      if (artist.status === "fulfilled") {
        setArtist(artist.value.data)
      } else {
        const error = artist.reason as AxiosError<{error: string}>
        console.error("Artist fetch failed", error.response?.data.error)
        setError(error.response?.data.error ?? error.message)
      }

      if (reviews.status === "fulfilled") {
        setReviews(reviews.value.data)
      } else {
        const error = reviews.reason as AxiosError<{error: string}>
        console.error("Review fetch failed", error.response?.data.error)
        setError(error.response?.data.error ?? error.message)
      }

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [artistId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { artist, reviews, loading, fetchData, setReviews, setArtist, error }

}