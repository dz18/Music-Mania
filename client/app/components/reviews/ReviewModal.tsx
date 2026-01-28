import { ApiPageResponse, Release, ReviewResponse, ReviewTypes } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import { Loader2, Star, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import IndeterminateLoadingBar from "../ui/loading/IndeterminateLoadingBar";
import { Song } from "@/app/lib/types/song";
import useFetchUserReview from "@/app/hooks/api/reviews/useFetchReviews";
import LoadingBox from "../ui/loading/loadingBox";
import StarRating from "./StarRating";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function ReviewModal ({
  item,
  itemId,
  type,
  open,
  setOpen,
  review,
  setReview,
  coverArtUrl,
  setData
} : {
  item: Artist | Release | Song,
  itemId: string
  type: 'artist' | 'release' | 'song'
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
  review: ReviewTypes | null
  setReview: Dispatch<SetStateAction<ReviewTypes | null>>
  coverArtUrl?: string
  setData: Dispatch<SetStateAction<ApiPageResponse<ReviewResponse> | null>>
}) {

  const { data: session, status} = useSession()

  const [title, setTitle] = useState('')
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  const [hover, setHover] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmittion = async (status: 'PUBLISHED' | 'DRAFT') => {
    try {
      setLoading(true)
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        itemId: itemId,
        title: title,
        rating: rating,
        review: reviewText,
        type: type,
        status: status,
        itemName: ('name' in item) ? item.name : null,
        itemTitle: ('title' in item) ? item.title : null,
        artistCredit: ('artistCredit' in item) ? item.artistCredit : null,
        coverArt: coverArtUrl,
      }, {
        headers : {
          Authorization: `Bearer ${session?.user.token}`
        }
      })

      setReview(res.data.review)
      setData(prev => {
        if (!prev) return prev

        return {
          ...prev,
          data: {
            ...prev.data,
            avgRating: res.data.avg,
            starStats: res.data.starStats,
            reviews: prev.data.reviews,
          },
          count: res.data.count
        }
      })

      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletion = async () => {
    try {
      setLoading(true)

      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`
        },
        params: {
          itemId, 
          type
        }
      })

      console.log(res.data)
      setReview(null)
      setData(prev => {
        if (!prev) return prev

        return {
          ...prev,
          data: {
            ...prev.data,
            avgRating: res.data.avg,
            starStats: res.data.starStats,
            reviews: prev.data.reviews.filter(r => r.userId !== res.data.review.userId) as any,
          },
          count: res.data.count,
        }
      })

      setOpen(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error ?? 'Unknown error')
      }
      console.error(error)
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!review) return

    setTitle(review.title ?? "")
    setRating(review.rating ?? 0)
    setReviewText(review.review ?? "")

  }, [review])

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className={`
        bg-surface border-white/5 border rounded-2xl 
        shadow-[0px_0px_10px_2px_rgba(255,255,255,0.1)] 
        p-4 w-[90%] max-w-lg relative
      `}>

        <div className={`flex ${review?.status ? 'justify-between' : 'justify-end'} border-b-1 border-gray-500 pb-2`}>
          {review?.status &&
            <div className="text-xs flex gap-1 items-end tracking-wide">
              <span
                className=" font-semibold"
              >
                Status: 
              </span>
              <span className={`${review?.status === 'DRAFT' ? "text-orange-500" : "text-teal-500"}`}>
                {review?.status}
              </span>
            </div>
          }
          <button
            className="text-gray-500 hover:text-gray-200 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <X/>
          </button>
        </div>

        <div className="py-2 flex flex-col gap-3">

          <div className="flex flex-col text-xs">
            <label className="font-mono mb-1 flex justify-between">
              <p className="tracking-wide font-semibold">
                Title <span className="text-gray-500 font-normal">[Optional]</span>
              </p>
              <p className="text-gray-500">{title?.length}/48</p>
            </label>
            <input 
              type="text"
              className=" border-white/5 border bg-black/50 px-2 py-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={48}
              disabled={loading}
            />
          </div>

          <div>
            <label className="font-mono mb-1 flex justify-between text-xs tracking-wide font-semibold">Rating</label>
              <StarRating
                hover={hover}
                setHover={setHover}
                rating={rating}
                setRating={setRating}
              />
              <div className="mt-1 text-xs font-mono">
                {rating}/5
              </div>
          </div>

          <div>
            <label className="font-mono mb-1 flex justify-between tracking-wide text-xs">
              <p className="font-semibold">Review: </p>
              <p className="text-gray-500">{reviewText.length}/1024</p>
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="bg-black/50 border-black px-2 py-1 w-full text-xs"
              maxLength={1024}
              rows={10}
              disabled={loading}
            />
          </div>


          <div className="text-sm flex gap-4 justify-between">
            <div className="flex gap-2">
              <button 
                className="text-gray-300 px-2 py-1 border-1 border-gray-300 rounded hover:bg-gray-800 cursor-pointer"
                onClick={() => handleSubmittion('DRAFT')}
                disabled={loading}
              >
                Save as Draft
              </button>  
              {review &&
                <button
                  className="text-red-500 px-2 py-1 border-1 border-red-500 rounded hover:bg-red-900 cursor-pointer"
                  onClick={handleDeletion}
                  disabled={loading}
                >
                  Remove
                </button>
              }
            </div>
            <div className="flex gap-2 items-center">
              <button 
                className="text-teal-300  bg-teal-950 px-2 py-1 border-1 rounded cursor-pointer hover:bg-teal-900"
                onClick={() => handleSubmittion('PUBLISHED')}
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