import { Release, ReviewResponse } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import axios from "axios";
import { stat } from "fs";
import { Loader, Star, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import IndeterminateLoadingBar from "../ui/loading/IndeterminateLoadingBar";
import { Song } from "@/app/lib/types/song";

export default function ReviewModal ({
  item,
  type,
  open,
  setOpen,
  reviews,
  setReviews,
  coverArtUrl,
} : {
  item: Artist | Release | Song | null,
  type: 'artist' | 'release' | 'song'
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
  reviews?: UserArtistReview[] | UserReleaseReview[] | UserSongReview[] | null
  setReviews: Dispatch<SetStateAction<ReviewResponse | null>>
  coverArtUrl?: string
}) {

  const {data: session, status} = useSession()

  const [title, setTitle] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [hover, setHover] = useState<number | null>(null)
  const [reviewExists, setReviewExist] = useState(false)
  const [review, setReview] = useState<string>('')
  const [reviewId, setReviewId] = useState<string>('')
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
        setTitle(review.data.title)
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

    console.log('action',res.data.action)
    console.log('status',status)
    setReviews(prev => {
      if (status === 'PUBLISHED') {
        if (!prev) {
          return {
            avgRating: res.data.avg,
            reviews: [res.data.review]
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
            : [res.data.review, ...prev.reviews]
        }
      } else if (status === 'DRAFT' || status === 'DELETED') {
        return {
          avgRating: res.data.avg,
          reviews: prev?.reviews.filter(r => r.userId !== session?.user.id)
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

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 rounded-2xl shadow-xl p-4 w-[90%] max-w-lg relative">

        <div className={`flex ${currentStatus ? 'justify-between' : 'justify-end'} border-b-1 border-gray-500 pb-2`}>
          {currentStatus &&
            <p className="text-sm">
              <span className="text-gray-500">Status: </span>
              {currentStatus}
            </p>
          }
          <button
            className="text-gray-500 hover:text-gray-200 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <X/>
          </button>
        </div>

        <div className="py-2 flex flex-col gap-3">

          <div className="flex flex-col">
            <label className="text-sm font-mono mb-1 flex justify-between">
              <p>
                Title <span className="text-gray-500">[Optional]</span>
              </p>
              <p className="text-gray-500">{title.length}/48</p>
            </label>
            <input 
              type="text"
              className="bg-gray-950 border-black p-1 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={48}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-mono mb-1 flex justify-between">Rating</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                className="focus:outline-none"
                disabled={loading}
              >
                <Star
                  size={18}
                  className={`
                    ${
                      star <= rating
                        ? "fill-amber-500 text-amber-500"
                        : star <= (hover ?? 0)
                        ? "fill-amber-200 text-amber-200"
                        : "fill-gray-300 text-gray-300"
                    }
                    cursor-pointer
                  `}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm font-mono mb-1 flex justify-between">
              <p>Review: </p>
              <p className="text-gray-500">{review.length}/1024</p>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="bg-gray-950 border-black p-1 text-sm w-full"
              maxLength={1024}
              rows={10}
              disabled={loading}
            />
          </div>


          <div className="text-sm flex gap-4 justify-between">
            <div className="flex gap-2">
              <button 
                className="text-gray-300 px-2 py-1 border-1 border-gray-300 rounded hover:bg-gray-800 cursor-pointer"
                onClick={() => handleButton('DRAFT')}
                disabled={loading}
              >
                Save as Draft
              </button>  
              {reviewExists &&
                <button
                  className="text-red-500 px-2 py-1 border-1 border-red-500 rounded hover:bg-red-900 cursor-pointer"
                  onClick={deleteReview}
                  disabled={loading}
                >
                  Remove
                </button>
              }
            </div>
            <div className="flex gap-2 items-center">
              <button 
                className="text-teal-300  bg-teal-950 px-2 py-1 border-1 rounded cursor-pointer hover:bg-teal-900"
                onClick={() => handleButton('PUBLISHED')}
                disabled={loading}
              >
                Publish
              </button>    
            </div>
          </div>

        </div>
        {loading &&
          <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
        }
      </div>
    </div>
  )
}