import { Album, ReviewResponse } from "@/app/lib/types/api";
import { Artist, Review } from "@/app/lib/types/artist";
import axios from "axios";
import { Loader, Star, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function ReviewModal ({
  item,
  type,
  open,
  setOpen,
  reviews,
  setReviews
} : {
  item: Artist | Album | Song | null,
  type: string
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
  reviews?: Review[] | null
  setReviews: Dispatch<SetStateAction<ReviewResponse | null>>
}) {

  const {data: session} = useSession()

  const [title, setTitle] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [hover, setHover] = useState<number | null>(null)
  const [review, setReview] = useState<string>('')
  const [reviewId, setReviewId] = useState<string>('')
  const [currentStatus, setCurrentStatus] = useState<'Published' | 'Draft' | ''>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      const review = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/user`, {
        params: { userId: session?.user.id, itemId: item?.id }
      })

      console.log(review.data)
      if (!review.data) return
      setTitle(review.data.title)
      setRating(review.data.rating)
      setReview(review.data.review)
      setReviewId(review.data.id)
      setCurrentStatus(review.data.status.charAt(0) + review.data.status.slice(1).toLowerCase())
    }
    fetchData()
  }, [item])

  const updateReviews = (res: any, status?: 'PUBLISHED' | 'DRAFT' | 'DELETED') => {
    console.log(res.data)
    if (res.data.action === 'UPDATED' && status === 'PUBLISHED') {
      setReviews(prev => {
        if (!prev) {
          return {
            avgRating: res.data.avg,
            reviews: [res.data.review]
          } as ReviewResponse
        }

        const exists = prev.reviews.some(r => r.id === res.data.review.id)

        return {
          ...prev,
          avgRating: res.data.avg,
          reviews: exists
            ? prev.reviews.map(r =>
                r.id === res.data.review.id ? res.data.review : r
              )
            : [...prev.reviews, res.data.review]
        }
      })
    } else if (res.data.action === 'CREATED' && status === 'PUBLISHED') {
      setReviews(prev => {
        if (!prev) {
          return {
            avgRating: res.data.avg,
            reviews: [res.data.review]
          } as ReviewResponse
        }

        return {
          ...prev,
          avgRating: res.data.avg,
          reviews: [res.data.review, ...prev.reviews]
        }
      })
    } else if ((res.data.action === 'UPDATED' || res.data.action === 'DELETED') && (status === 'DRAFT' || status == 'DELETED')) {
      setReviews(prev => {
        if (!prev) {
          return {
            avgRating: res.data.avg,
            reviews: []
          } as ReviewResponse
        }

        return {
          ...prev,
          avgRating: res.data.avg,
          reviews: prev.reviews.filter(r => r.id !== res.data.review.id)
        }
      })
    } 
  }

  const handleButton = async (action: 'PUBLISHED' | 'DRAFT') => {
    try {
      setLoading(true)

      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/`, {
        userId: session?.user.id,
        itemId: item?.id,
        title: title,
        rating: rating,
        review: review,
        type: type !== 'album' ? type.toUpperCase() : 'RELEASE',
        status: action
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
          id: reviewId
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
              <p className="text-gray-500">{review.length}/512</p>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="bg-gray-950 border-black p-1 text-sm w-full"
              maxLength={512}
              rows={10}
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
              {reviewId &&
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
              {loading &&
                <Loader size={18} className="animate-spin text-teal-300"/>
              }
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

      </div>
    </div>
  )
}