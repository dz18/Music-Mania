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

export default function ReleasePage ({
  releaseId,
  star
} : {
  releaseId: string,
  star: number | null
}) {

  const { status } = useSession()
  const [active, setActive] = useState('reviews')
  const {
    coverArt,
    data,
    loading,
    error,
    release,
    releaseLoad,
    setData,
    fetchData,
    starStats,
    setStarStats
  } = useFetchRelease(releaseId, star)
  const [review, setReview] = useState<ReviewTypes | null>(null)

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
        func={() => fetchData(1)}
        title={'Release Page'}
        loading={loading}
        note={error}
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        {/* Text content */}
        {data &&
          <TextContent
            album={release}
            reviews={data?.data}
            coverArt={coverArt}
            loading={loading}
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
              item={release} 
              itemId={releaseId} 
              type="release"
              review={review}
              setReview={setReview}
              setData={setData}
              coverArtUrl={coverArt}
              setStarStats={setStarStats}
            />
          }
        </div>
      }

      {review &&
        <YourReviewSection review={review}/>
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
        {loading ?
          <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
        : data &&
          <>
            <Reviews data={data}/>
            <Pagination data={data} fetchData={fetchData}/>
          </>
        }
        </>
      }

      {active === 'tracklist' &&
        <>
        {loading &&
          <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
        }
        {release &&
          <Tracklist album={release}/>
        }
        </>
      }

    </div>
  )
}