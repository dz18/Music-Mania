import { ReviewResponse } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import axios from "axios";
import { useEffect, useState } from "react";

export default function fetchArtist (artistId: string) {
  
  const [loading, setLoading] = useState(false)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [reviews, setReviews] = useState<ReviewResponse | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [artist, reviews] = await Promise.allSettled([
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
          params : {id : artistId}
        }),
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/artist`, {
          params: {id: artistId}
        })
      ])

      if (artist.status === "fulfilled") {
        setArtist(artist.value.data)
      } else {
        console.error("Artist fetch failed", artist.reason)
      }

      if (reviews.status === "fulfilled") {
        setReviews(reviews.value.data)
      } else {
        console.error("Reviews fetch failed", reviews.reason)
      }

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return { artist, reviews, loading, fetchData, setReviews, setArtist }

}