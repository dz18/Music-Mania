import { Release, ReviewResponse } from "@/app/lib/types/api"
import axios from "axios"
import { useEffect, useState } from "react"

export default function fetchRelease (releaseId: string) {

  const [coverArt, setCoverArt] = useState('')
  const [album, setAlbum] = useState<Release | null>(null)
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState<ReviewResponse | null>(null)
    
  useEffect(() => {
    fetchData()
  }, [releaseId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [album, reviews] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getRelease`, {
          params: {releaseId: releaseId}
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/release`,{
          params: {id: releaseId}
        })
      ])
      setCoverArt(album.data.coverArtUrl)
      setAlbum(album.data.album)
      setReviews(reviews.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    coverArt,
    album,
    loading,
    reviews,
    fetchData,
    setReviews
  }
}