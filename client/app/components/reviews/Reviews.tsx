import { ApiPageResponse, ReviewResponse } from "@/app/lib/types/api"
import StarRatingVisual from "../ui/StarVisual"
import { useRouter } from "next/navigation"
import IndividualReview from "./IndividualReview"

export default function Reviews ({
  data,
} : {
  data: ApiPageResponse<ReviewResponse>
}) {

  return (
    <div
      className="rounded-lg overflow-hidden border-gray-500 border"
    >

      <div className="bg-surface-elevated text-sm font-mono px-2 py-2 flex justify-between">
        <p className="font-semibold">Recent Reviews</p>
        <p className="text-gray-500">{data.count} total reviews</p>
      </div>

      {data.count !== 0 ? 
        data.data.reviews.map((r, i) => (
          <IndividualReview review={r} index={i} key={r.userId}/>
        ))
      :
        <p className="p-2 text-sm font-mono text-gray-500">Start the conversation!</p>
      }


    </div>
    
  )
}