import { ReviewTypes } from "@/app/lib/types/api"
import StarRatingVisual from "../ui/StarVisual"

export default function YourReviewSection ({
  review
}:{
  review: ReviewTypes | null
}) {

  if (!review) return null

  return (
    <div
      className="border border-gray-500 rounded-lg overflow-hidden"
    >
      <p
        className="bg-surface-elevated px-2 py-1 font-mono text-sm font-semibold"
      >
        Your Rating
      </p>

      <div className="px-4 py-2 text-sm flex flex-col gap-2 bg-surface">
        <div className="flex border-b border-white/5 items-center justify-between pb-1">
          <div className="font-semibold font-mono">{review.title}</div>
          <div className="flex gap-2">
            <p className="font-semibold">{review.rating}</p>
            <StarRatingVisual rating={Number(review.rating) ?? 0}/>
          </div>
        </div>
        <p>{review.review}</p>          
        <p className="text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
      </div>

    </div>
  )
}