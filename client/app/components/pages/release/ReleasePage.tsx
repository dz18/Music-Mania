'use client'

import Reviews from "@/app/components/reviews/Reviews";
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar";
import { useSession } from "next-auth/react";
import { useState } from "react"
import Tracklist from "@/app/components/pages/release/Tracklist";
import LoadingBox from "@/app/components/ui/loading/loadingBox";
import LoadingText from "@/app/components/ui/loading/LoadingText";
import RefreshPage from "@/app/components/ui/RefreshPage";
import useFetchRelease from "@/app/hooks/musicbrainz/useFetchRelease";
import Pagination from "@/app/components/ui/Pagination";
import TextContent from "@/app/components/pages/release/TextContent";
import StarStatistics from "../../ui/starStatistics";
import UserReviewPanel from "../../reviews/UserReviewPanel";
import { ReviewTypes } from "@/app/lib/types/api";
import YourReviewSection from "../../reviews/YourReview";
import { useSearchParams } from "next/navigation";
import useFetchUserReview from "@/app/hooks/api/reviews/useFetchUserReview";

export default function ReleasePage ({
  releaseId,
} : {
  releaseId: string,
}) {

  const { status } = useSession()
  const searchParams = useSearchParams()

  const [active, setActive] = useState('reviews')

  // const {
  //   coverArt,
  //   data,
  //   loading,
  //   error,
  //   release,
  //   releaseLoad,
  //   setData,
  //   fetchData,
  //   starStats,
  //   setStarStats
  // } = useFetchRelease(releaseId, star)

  const {
    release, releaseLoad,
    reviews, reviewsLoad,
    starStats, error,
    refetchRelease, refetchReviews
  } = useFetchRelease(releaseId)

  const {
    userReview
  } = useFetchUserReview(releaseId, 'release')

  if (releaseLoad) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <LoadingText text="Searching for Release"/>
            </div>
            <div className="flex flex-col gap-2">
              <LoadingBox className="w-50 h-4"/>
              <LoadingBox className="w-25 h-4"/>
            </div>
            <div className="flex flex-col gap-2">
              <LoadingBox className="w-40 h-4"/>
              <LoadingBox className="w-60 h-4"/>
            </div>
            <div className="flex flex-col gap-2">
              <LoadingBox className="w-40 h-4"/>
              <LoadingBox className="w-30 h-4"/>
            </div>
            <div className="flex flex-col gap-2">
              <LoadingBox className="w-50 h-4"/>
              <LoadingBox className="w-25 h-4"/>
            </div>
          </div>
          <div>
            <LoadingBox className="w-100 h-100"/>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <LoadingBox className="w-full h-50"/>
          <LoadingBox className="w-full h-10"/>
          <LoadingBox className="w-full h-50"/>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <RefreshPage
        func={async () => { await refetchRelease()}}
        title={'Release Page'}
        loading={releaseLoad}
        note={error.message}
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        {/* Text content */}
        {reviews &&
          <TextContent
            release={release?.release}
            reviews={reviews.data}
            coverArt={release?.coverArtUrl}
            loading={releaseLoad}
          />
        }
      </div>

      {starStats &&
        <div
          className="flex gap-2 items-stretch"
        >
          <StarStatistics stats={starStats}/>
          {status === 'authenticated' &&
            <UserReviewPanel 
              item={release?.release} 
              itemId={releaseId} 
              type="release"
              coverArtUrl={release?.coverArtUrl}
            />
          }
        </div>
      }

      {userReview &&
        <YourReviewSection review={userReview}/>
      }

      <ul className="flex list-none flex-wrap gap-4 text font-mono font-bold mt-2">
        <li 
          className={`px-2 py-1 border-b-2 cursor-pointer ${active === 'reviews' ? 'text-teal-300  bg-teal-800' : "border-transparent"}`}
          onClick={() => setActive('reviews')}
        >
          Reviews
        </li>
        <li
          className={`px-2 py-1 border-b-2 cursor-pointer ${active === 'tracklist' ? 'text-teal-300  bg-teal-800' : "border-transparent"}`}
          onClick={() => setActive('tracklist')}
        >
          Tracklist
        </li>
      </ul>


      {active === 'reviews' &&
        <>
        {reviewsLoad ?
          <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
        : reviews &&
          <>
            <Reviews data={reviews}/>
            {reviews.count > reviews.limit && (
              <Pagination totalPages={reviews.pages}/>
            )}            
          </>
        }
        </>
      }

      {active === 'tracklist' &&
        <>
        {releaseLoad &&
          <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
        }
        {release &&
          <Tracklist release={release.release}/>
        }
        </>
      }

    </div>
  )
}