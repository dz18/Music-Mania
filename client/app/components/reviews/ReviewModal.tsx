import { ApiPageResponse, Release, ReviewResponse, ReviewTypes } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import IndeterminateLoadingBar from "../ui/loading/IndeterminateLoadingBar";
import { Song } from "@/app/lib/types/song";
import StarRating from "./StarRating";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function ReviewModal ({
  item,
  itemId,
  type,
  open,
  setOpen,
  review,
  setReview,
  coverArtUrl,
  setData,
  setStarStats
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
  setStarStats: Dispatch<SetStateAction<StarCount[]>>
}) {

  const MAX_REVIEW_LENGTH = 2048;
  const MAX_TITLE_LENGTH = 48;
  const MAX_TAGS = 5;

  const searchParams = useSearchParams()
  const star = searchParams.get('star')

  const { data: session, status} = useSession()

  const [title, setTitle] = useState('')
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const [hover, setHover] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ReviewModalErrors>({
    title: '',
    rating: '',
    reviewText: '',
    tag: '',
    tags: ''
  })

  const verifyInputs = () => {
    const errors: ReviewModalErrors = {
      title: '',
      rating: '',
      reviewText: '',
      tag: '',
      tags: ''
    }

    if (reviewText.length > MAX_REVIEW_LENGTH) {
      errors.reviewText = `Character limit exceeded (${MAX_REVIEW_LENGTH} chars max).`
    }
    if (title.length > MAX_TITLE_LENGTH) {
      errors.title = `Character limit exceeded (${MAX_TITLE_LENGTH} chars max).`
    }
    if (rating < 0.5) {
      errors.rating = `Rating score can't be less than 0.5.`
    } else if (rating > 5) {
      errors.rating = `Rating score can't exceed 5.`
    } else if ((rating * 2) % 1 !== 0) {
      errors.rating = `Rating score must be in increments of 0.5.`
    }
    if (tags.length > MAX_TAGS) {
      errors.tags = `Tag limit exceeded (${MAX_TAGS} max).`
    }
    setError(errors)
    return Object.values(errors).some(err => err !== '')
  }

  const handleSubmittion = async (status: 'PUBLISHED' | 'DRAFT') => {

    let hasError = verifyInputs()
    if (hasError) return

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
        tags: tags
      }, {
        headers : {
          Authorization: `Bearer ${session?.user.token}`
        }
      })

      if (status === 'PUBLISHED') {
        setStarStats(res.data.starStats)

          setData(prev => {
            if (!prev) return prev
            
            const exists = prev.data.reviews.some(r => r.userId === session?.user.id)
            let reviews
            if (!star || Number(star) === rating) {
              reviews = exists 
                ? prev.data.reviews.map(r => r.userId === session?.user.id ? res.data.review : r)
                : [res.data.review, ...prev.data.reviews]
            } else {
              reviews = exists
                ? prev.data.reviews.filter(r => r.userId !== session?.user.id)
                : [...prev.data.reviews]
            }

            return {
              ...prev,
              data: {
                ...prev.data,
                avgRating: res.data.avg,
                starStats: res.data.starStats,
                reviews: reviews
              },
              count: res.data.count
            }

          })
      }

      if (status === 'DRAFT') {
        setStarStats(res.data.starStats)
        setData(prev => {
          if (!prev) return null

          const exists = prev.data.reviews.some(r => r.userId === session?.user.id)
          const reviews = prev.data.reviews.filter(r => r.userId !== session?.user.id)

          return {
            ...prev,
            data: {
              ...prev.data,
              avgRating: res.data.avg,
              starStats: res.data.starStats,
              reviews: reviews as typeof prev.data.reviews
            },
            count: exists ? prev.count - 1 : prev.count,
          }
        })
      }

      setReview(res.data.review)
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
      setStarStats(res.data.starStats)
      setData(prev => {
        if (!prev) return prev

        const reviews = prev.data.reviews.filter(r => r.userId !== res.data.review.userId) 

        return {
          ...prev,
          data: {
            ...prev.data,
            avgRating: res.data.avg,
            starStats: res.data.starStats,
            reviews: reviews as typeof prev.data.reviews,
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

  const handleAddTag = () => {
    if (tags.includes(tag)) { 
      alert(`${tag} already include as a tag. Please try another one!`)
      return
    }

    if (tags.length >= 5) return

    if (!tag.trim()) return

    setTags(prev => ([...prev, tag.trim()]))
    setTag('')
  }

  useEffect(() => {
    if (!review) return

    setTags(review.tags ?? [])
    setTitle(review.title ?? "")
    setRating(Number(review.rating) ?? 0)
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
              <p className="text-gray-500">{title?.length}/{MAX_TITLE_LENGTH}</p>
            </label>
            <input 
              type="text"
              className=" border-white/5 border bg-black/50 px-2 py-1 input-glow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_TITLE_LENGTH}
              disabled={loading}
            />
            {error.title && <p className="text-sm text-red-500">{error.title}</p>}
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
            {error.rating && <p className="text-sm text-red-500">{error.rating}</p>}
          </div>

          {/* Review */}
          <div>
            <label className="font-mono mb-1 flex justify-between tracking-wide text-xs">
              <p className="font-semibold">Review: </p>
              <p className="text-gray-500">{reviewText.length}/{MAX_REVIEW_LENGTH}</p>
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="bg-black/50 border-black px-2 py-1 w-full text-xs input-glow"
              maxLength={MAX_REVIEW_LENGTH}
              rows={15}
              disabled={loading}
            />
            {error.reviewText && <p className="text-sm text-red-500">{error.reviewText}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="font-mono mb-1 flex justify-between tracking-wide text-xs">
              <p className="font-semibold">Tag: </p>
            </label>
            <div className="flex gap-2 items-center">
              <input 
                type="text" 
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-1/2 bg-black/50 px-2 py-1 text-sm input-glow"
                maxLength={24}
              />
              <button 
                className="text-sm bg-teal-950 border border-teal-300 text-teal-300 hover:bg-teal-900 active:bg-teal-800 rounded px-2 py-1 cursor"
                onClick={handleAddTag}
              >
                Add
              </button>
              <p className="text-gray-500 text-sm font-mono">{tags.length}/{MAX_TAGS}</p>
            </div>
            {tags.length > 0 ?
              <ul className="list-none flex-wrap flex gap-2 mt-1">
                {tags.map(t =>
                  <li
                    key={t}
                    className="text-xs p-1 rounded underline hover:text-red-500 hover:line-through cursor-pointer"
                    onClick={() => setTags(prev => prev.filter(tag => tag !== t))}
                  >
                    {t}
                  </li>
                )}
              </ul>
            :
              <p className="font-mono text-gray-500 text-xs m-1">No Tags</p>
            }
            {error.tags && <p className="text-sm text-red-500">{error.tag}</p>}
          </div>


          <div className="text-sm flex gap-4 justify-between border-t-1 border-gray-500 pt-4">
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