import { Review } from "@/app/lib/types/artist"
import { Star, StarHalf } from "lucide-react"
import Link from "next/link"

export default function Reviews ({
  reviews,
} : {
  reviews: Review[] | null
}) {

  return (
    <>
      <p className="text-xl font-bold mb-2">{reviews?.length} {reviews?.length === 1 ? 'Review' : 'Reviews'}</p>  
      {reviews?.length !== 0 ?
        <div className="bg-gray-800 border-1">
          {reviews?.map((review, i) => (
            <div className={`${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} p-2`} key={review.id}>
              <div className="flex justify-between">
                <div className="flex gap-2 items-end">
                  <Link 
                    className="font-bold hover:underline flex gap-1 items-end"
                    href={`/profile/${review.user.id}`}
                  >
                    <img src={review.user.avatar}className="w-7"/>
                    <p>{review.user.username}</p>
                  </Link>
                  <span className="text-sm text-gray-500">{new Date(review.createAt).toLocaleDateString()}</span>
                </div>
                <div className="font-bold flex items-center gap-1 text-gray-300">
                  {review.rating}
                  {Array.from({length: Math.floor(review.rating)}).map((_, i) =>(
                    <Star size={18} className="fill-amber-500 stroke-0" key={i}/>
                  ))}
                  {review.rating % 1 !== 0 &&
                    <StarHalf size={18} className="fill-amber-500 stroke-0"/>
                  }
                  
                </div>
              </div>
              {review.comment &&
                <>
                  <div className="border-t-1 border-gray-500 mb-1"/>
                  <p className="text-sm">
                    {review.comment}
                  </p>
                </>
              }
            </div>
          ))}
        </div>
      :
        <div className="text-gray-500 font-mono text-sm">
          Start the Conversation!
        </div>
      }
    </>
    
  )
}