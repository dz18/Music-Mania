import { ApiPageResponse, ReviewRatingsResponse } from "@/app/lib/types/api"
import { FileX2, Star } from "lucide-react"
import Link from "next/link"

export default function ReviewRating ({
  data,
  loading,
  error
} : {
  data: ApiPageResponse<ReviewRatingsResponse>
  loading: Boolean
  error: string | null
}) {
  return (
    <div>
      <p className="text-xl font-bold mb-2">{data.count} {data.count === 1 ? 'Review' : 'Reviews'}</p>  
      {data.data.reviews?.length !== 0 ?
        <div className="bg-gray-800 border-1">
          {data.data.reviews?.map((review, i) => (
            <div className={`${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} p-2`} key={review.user.id}>
              <div className="flex justify-between">
                <div className="flex gap-2 items-end">
                  <Link 
                    className="font-bold hover:underline flex gap-1 items-end"
                    href={`/profile/${review.user.id}`}
                  >
                    <img src={review.user.avatar}className="w-7"/>
                    <p>{review.user.username}</p>
                  </Link>
                  <span className="text-sm text-gray-500">{new Date(review.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="font-bold flex items-center gap-1 text-gray-300">
                  {review.rating}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(review.rating)
                          ? "fill-amber-500 stroke-amber-500"
                          : "fill-gray-100 stroke-gray-100"
                      }
                    />
                  ))}
                  
                </div>
              </div>
                  <div className="border-t-1 border-gray-500 mb-1"/>
                  <div className="">
                    {review.title &&
                      <p className="font-bold text-sm mb-2">
                        {review.title}
                      </p>
                    }
                    <p className="text-sm">
                      {review.review}
                    </p>
                  </div>
            </div>
          ))}
        </div>
      :
        <div className="text-gray-500 font-mono flex items-center justify-center gap-2">
          <p className="text-center flex">No Data </p> <FileX2/>
        </div>
      }
    </div>
  )
}