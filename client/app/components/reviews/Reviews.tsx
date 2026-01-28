import { ApiPageResponse, ReviewResponse } from "@/app/lib/types/api"
import { Star } from "lucide-react"
import Link from "next/link"
import StarRatingVisual from "../ui/StarVisual"

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
        <p className="font-semibold">Reviews</p>
        <p className="text-gray-500">{data.count} total reviews</p>
      </div>

      {data.count !== 0 ?
        data.data.reviews.map((r, i) => (
          <div
            className={`
              ${i % 2 === 0 ? "bg-surface" : ""}
              p-2
            `}
          >
            <div
              className="flex justify-between"
            >

              <div className="flex items-baseline gap-1">
                <img 
                  src={`
                    ${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${r.userId}
                  `} 
                  className="w-7 h-7 object-cover "
                  alt="Avatar"
                  onError={e => e.currentTarget.src = '/default-avatar.jpg'} 
                />
                <p className="font-mono text-sm">{r.user.username}</p>
              </div>
              
              <div className="flex items-center gap-2 font-mono font-semibold">
                {r.rating}<StarRatingVisual rating={Number(r.rating)}/>
              </div>
            </div>
            
            {r.review &&
              <div className="text-sm mt-1 pt-1 border-t border-white/5">
                <p className="font-semibold">{r.title}</p>
                <p>{r.review}</p>
              </div>
            }

            <p className="text-gray-500 text-sm mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>

          </div>
        ))
      :
        <p className="p-2 text-sm font-mono text-gray-500">Start the conversation!</p>
      }


    </div>

    // <div
    //   className="rounded-xl overflow-hidden border-gray-500 border"
    // >
    //   <div className="text-md flex justify-between items-center tracking-wide font-mono px-4 py-2 bg-surface-elevated">
    //     <span className="font-bold">Reviews</span>
    //     <span className="text-gray-500">{data.count} total reviews</span>
    //   </div>  

    //   {data.data.reviews?.length !== 0 ?
    //     <div>
    //       {data.data.reviews?.map((review, i) => (
    //         <div className={`${i % 2 === 0 && 'bg-surface'} px-4 py-2 border-white/5 border-t`} key={review.user.id}>
    //           <div className="flex justify-between">
    //             <div className="flex gap-2 items-end">
    //               <Link 
    //                 className="font-bold hover:underline flex gap-1 items-end"
    //                 href={`/profile/${review.user.id}`}
    //               >
    //                 <img 
    //                   src={`${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${review.user.id}`}
    //                   onError={e => e.currentTarget.src = '/default-avatar.jpg'}
    //                   className="w-7"
    //                 />
    //                 <p>{review.user.username}</p>
    //               </Link>
    //               <span className="text-sm text-gray-500">{new Date(review.updatedAt).toLocaleDateString()}</span>
    //             </div>
    //             <div className="font-bold flex items-center gap-1 text-gray-300">
    //               {review.rating}
    //               {Array.from({ length: 5 }).map((_, i) => (
    //                 <Star
    //                   key={i}
    //                   size={18}
    //                   className={
    //                     i < Math.floor(review.rating)
    //                       ? "fill-amber-500 stroke-amber-500"
    //                       : "fill-gray-100 stroke-gray-100"
    //                   }
    //                 />
    //               ))}
                  
    //             </div>
    //           </div>
    //               <div className="border-t-1 border-gray-500 mb-1"/>
    //               <div className="">
    //                 {review.title &&
    //                   <p className="font-bold text-sm mb-2">
    //                     {review.title}
    //                   </p>
    //                 }
    //                 <p className="text-sm">
    //                   {review.review}
    //                 </p>
    //               </div>
    //         </div>
    //       ))}
    //     </div>
    //   :
    //     <div className="text-gray-500 font-mono text-sm mx-4 my-2">
    //       Start the Conversation!
    //     </div>
    //   }
    // </div>
    
  )
}