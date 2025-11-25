
'use client'

import useFetchReviewRatings from "@/app/hooks/api/ratings/useFetchRatings"
import ReviewRating from "./ItemReviewRating"
import LoadingBox from "../../ui/loading/loadingBox"
import { Star } from "lucide-react"
import Pagination from "../../ui/Pagination"
import { useEffect } from "react"

export default function ItemReviewRatingPage ({
  id,
  star
} : {
  id: string,
  star: number
}) {

  const { 
    data, loading, error, coverArt,
    item, itemLoad, fetchData 
  } = useFetchReviewRatings(id, star)

  useEffect(() => {
    console.log('item', item)
  }, [item])

  return (
    <div className="flex flex-col gap-2">

      <div className="flex justify-between">
        {itemLoad ? (
          <div>
            <LoadingBox className=""/>
          </div>
        ) : (
          item && (
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap gap-2 items-baseline">
                <p className="font-mono font-bold text-lg leading-none">
                  {'name' in item ? item.name : item.title}
                </p>

                {!('artistCredit' in item ) ? (
                  <p className="font-mono text-gray-500 text-sm leading-none">
                    {item.disambiguation}
                  </p>
                ) : (
                  <p className="font-mono text-gray-500 text-sm leading-none">
                    {item.artistCredit.map(ac => `${ac.name}${ac.joinphrase}`)}
                  </p>
                )}

              </div>

              <p className="text-sm font-mono text-gray-500">
                All {star} star ratings
              </p>
            </div>
          )
        )}

        <div className="font-bold flex gap-2 text-lg">
          <p>{star} / 5.0 </p><Star className="fill-amber-500 stroke-amber-500"/>
          {coverArt &&
            <img src={coverArt} className="w-50" />
          }
        </div>

      </div>

      

      {data && 
        <ReviewRating
          data={data}
          loading={loading}
          error={error}
        />
      }

      {data && data.data.reviews.length !== 0 &&
        <Pagination
          data={data}
          fetchData={fetchData}
        />
      }
    </div>
  )
}