import { ArrowBigDown, ArrowBigUp, CirclePlus, MessageCircle, Tags, ThumbsUp } from "lucide-react";
import StarRatingVisual from "../ui/StarVisual";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ApiPageResponse, MusicTypes, ReviewResponse, ReviewTypes } from "@/app/lib/types/api";
import LikeButton from "./LikeButton";
import ReviewModal from "./ReviewModal";
 
export default function UserReviewPanel ({
  itemId, item, type, review, setReview, coverArtUrl, setData, setStarStats
} : {
  itemId: string
  item: MusicTypes | null
  type: 'artist' | 'release' | 'song'
  review: ReviewTypes | null
  setReview: Dispatch<SetStateAction<ReviewTypes | null>>
  coverArtUrl?: string,
  setData: Dispatch<SetStateAction<ApiPageResponse<ReviewResponse> | null>>
  setStarStats: Dispatch<SetStateAction<StarCount[]>>
}) {

  const { data: session, status } = useSession()

  const [like, setLike] = useState(null)
  const [error, setError] = useState('')
  const [openReview, setOpenReview] = useState(false)

  useEffect(() => {
    
    const fetchReview = async () => {
      if (status !== 'authenticated') return

      try {

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/review`, { 
          params: { itemId, type: type },
          headers: {
            Authorization: `Bearer ${session.user.token}`
          }
        })

        console.log(res.data)
        setReview(res.data.review)
        setLike(res.data.like)

      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.error ?? 'Unknown Error')
        }
        console.error(error)
      }
    }

    fetchReview()
  }, [status])

  if (!item) return null

  return (
    <div
      className="border border-gray-500 rounded-lg flex flex-col"
    >

      <p
        className="px-2 py-1 font-mono text-sm whitespace-nowrap bg-surface-elevated text-center font-semibold rounded-t-lg"
      >
        Review Panel
      </p>

      <div
        className="flex flex-col gap-2 p-2 text-xs grow min-h-0"
      >

        <section
          className="flex flex-col gap-2 w-full"
        >

          <div>
            <StarRatingVisual rating={Number(review?.rating) ?? 0}/>
          </div>


          <div className="flex gap-2 items-center">
            <span className="text-gray-500 text-xs ">
              Status:
            </span>
            <span
              className={`
                ${review?.status 
                    ? review?.status === 'PUBLISHED' 
                      ? 'text-teal-300 '
                      : 'text-orange-500'
                    : 'border-gray-500 text-gray-500'
                }
                rounded-full text-xs font-semibold text-center`
              }
            >
              {review?.status ? review?.status : 'N/A'}
            </span>
          </div>
          
        </section>

        <section className="flex flex-col gap-2 grow justify-end">

          <button
            className="border px-2 py-1 items-center rounded flex gap-2 justify-center interactive-button interactive-dark"
          >
            <CirclePlus size={18}/> Add to list
          </button>

          <LikeButton 
            item={item}
            itemId={itemId}
            like={like} 
            setLike={setLike}
            type={type}
            coverArt={coverArtUrl}
          />

          <button
            className="border border-teal-300 bg-teal-950 text-teal-300 px-2 py-1 rounded interactive-button hover:bg-teal-900 active:bg-teal-800 w-full"
            onClick={() => setOpenReview(true)}
          >
            Leave a Review
          </button>

        </section>

        
      </div>

      {openReview &&
        <ReviewModal
          item={item}
          itemId={itemId}
          type={type}
          open={openReview}
          setOpen={setOpenReview}
          setReview={setReview}
          review={review}
          coverArtUrl={coverArtUrl}
          setData={setData}
          setStarStats={setStarStats}
        />
      }

    </div>
  )
}