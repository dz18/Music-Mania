import { ReviewResponse } from "@/app/lib/types/api"
import { Song } from "@/app/lib/types/song"
import axios from "axios"
import { useEffect, useState } from "react"

export default function fetchSong (songId: string) {


  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(false)
  const [coverArt, setCoverArt] = useState('')
  const [reviews, setReviews] = useState<ReviewResponse | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [songResult, reviews] = await  Promise.allSettled([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getSong`, {
          params: { songId }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/song`,{
          params: { id: songId }
        })
      ])

      if (songResult.status === 'fulfilled') {
        console.log(songResult.value.data.song)
        setSong(songResult.value.data.song)
        setCoverArt(songResult.value.data.coverArtUrl)
      } else {
        console.error("Failed:", songResult.reason)
      }

      if (reviews.status === 'fulfilled') {
        setReviews(reviews.value.data)
      } else {
        console.error("Failed:", reviews.reason)
      }

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    song,
    loading,
    coverArt,
    reviews,
    setReviews,
    fetchData
  }

}