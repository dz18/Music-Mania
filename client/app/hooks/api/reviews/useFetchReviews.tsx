import { Release, ReviewResponse } from "@/app/lib/types/api"
import { Artist } from "@/app/lib/types/artist"
import { Song } from "@/app/lib/types/song"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"

export default function useFetchReviews (  
  item: Artist | Release | Song | null,
  type: "artist" | "release" | "song",
  setReviews: React.Dispatch<React.SetStateAction<ReviewResponse | null>>,
  setOpen: Dispatch<SetStateAction<boolean>>,
  reviews?: UserArtistReview[] | UserReleaseReview[] | UserSongReview[] | null,
  coverArtUrl?: string
) {

  const {data: session, status} = useSession()

  const [title, setTitle] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [reviewExists, setReviewExist] = useState(false)
  const [review, setReview] = useState<string>('')
  const [currentStatus, setCurrentStatus] = useState<'Published' | 'Draft' | ''>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const review = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/user`, {
          params: { userId: session?.user.id, itemId: item?.id, type: type }
        })

        console.log('review MODEL:', review.data)
        if (!review.data) return
        setReviewExist(review.data ? true : false)
        setTitle(review.data.title || '')
        setRating(review.data.rating)
        setReview(review.data.review)
        setCurrentStatus(review.data.status.charAt(0) + review.data.status.slice(1).toLowerCase())
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const updateReviews = (res: any, status?: 'PUBLISHED' | 'DRAFT' | 'DELETED') => {

    console.log(res.data)
    setReviews(prev => {
      if (status === 'PUBLISHED') {
        if (!prev) {

          return {
            avgRating: res.data.avg,
            reviews: [res.data.review],
            starStats: res.data.starStats
          } as ReviewResponse
        }

        return {
          avgRating: res.data.avg,
          reviews: exists 
            ? prev?.reviews.map(r => (
                r.userId === session?.user.id
                  ? res.data.review
                  : r
              ))
            : [res.data.review, ...prev.reviews],
          starStats: res.data.starStats
        }
      } else if (status === 'DRAFT' || status === 'DELETED') {
        return {
          avgRating: res.data.avg,
          reviews: prev?.reviews.filter(r => r.userId !== session?.user.id),
          starStats: res.data.starStats
        } as ReviewResponse
      } 

      return prev
    })

  }

  const handleButton = async (action: 'PUBLISHED' | 'DRAFT') => {
    if (!item) return

    try {
      setLoading(true)

      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/`, {
        userId: session?.user.id,
        itemId: item?.id,
        title: title,
        rating: rating,
        review: review,
        type: type.toUpperCase(),
        status: action,
        itemName: 'name' in item ? item.name : null,
        itemTitle: 'title' in item ? item.title : null,
        artistCredit: 'artistCredit' in item ? item.artistCredit.map(ac => ({joinphrase: ac.joinphrase, name: ac.name})) : null,
        coverArt: coverArtUrl
      })

      updateReviews(res, action)
      
      setOpen(false)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async () => {
    try {
      setLoading(true)
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/`, {
        params: {
          userId: session?.user.id,
          itemId: item?.id,
          type: type
        }
      })
      console.log(res.data)

      updateReviews(res, 'DELETED')
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const exists = useMemo(() => (
    status === 'authenticated' ? reviews?.some(r => r.userId === session?.user.id) : false
  ), [review])

  return {
    title,
    rating,
    reviewExists,
    review,
    currentStatus,
    loading,

    setLoading,
    setRating,
    setReview,
    setTitle,

    updateReviews,
    handleButton,
    deleteReview
  }

}