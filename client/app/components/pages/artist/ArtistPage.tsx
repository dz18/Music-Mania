'use client'

import About from "@/app/components/pages/artist/About"
import Reviews from "@/app/components/reviews/Reviews"
import { useSession } from "next-auth/react"
import { useState } from "react"
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar"
import LoadingBox from "@/app/components/ui/loading/loadingBox"
import RefreshPage from "@/app/components/ui/RefreshPage"
import LoadingText from "@/app/components/ui/loading/LoadingText"
import useFetchArtist from "@/app/hooks/musicbrainz/useFetchArtist"
import Pagination from "@/app/components/ui/Pagination"
import StarStatistics from "../../ui/starStatistics"
import UserReviewPanel from "../../reviews/UserReviewPanel"
import { ReviewTypes } from "@/app/lib/types/api"
import YourReviewSection from "../../reviews/YourReview"

export default function ArtistPage ({
  artistId,
  star
} : {
  artistId: string,
  star: number | null
}) {

  const { status } = useSession()
  const { 
    artist, reviewsload, artistLoad, fetchData, 
    error, data, setData, starStats, setStarStats
  } = useFetchArtist(artistId, star)

  const [review, setReview] = useState<ReviewTypes | null>(null)

  if (artistLoad) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <LoadingText text="Searching for artist"/>
            <LoadingBox className="w-50 h-8"/>
          </div>
          <div className="flex">
            <LoadingBox className="w-50 h-8"/>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <LoadingBox className="w-20 h-4"/>
          <LoadingBox className="w-[25%] h-4"/>
          <LoadingBox className="w-20 h-4"/>
          <LoadingBox className="w-[50%] h-4"/>
          <LoadingBox className="w-20 h-4"/>
          <LoadingBox className="w-[25%] h-4"/>
          <LoadingBox className="w-20 h-4"/>
          <LoadingBox className="w-[75%] h-4"/>
        </div>
        <div className="flex flex-col gap-2">
          <LoadingBox className="w-50 h-8"/>
          <div className="flex h-40">
            <LoadingBox className="w-full h-full"/>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <LoadingBox className="w-50 h-8"/>
          <div className="flex h-40">
            <LoadingBox className="w-full h-full"/>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <RefreshPage
        func={() => fetchData(1)}
        title={'Artist Page'}
        loading={artistLoad}
        note={error}
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">

      <div className="flex gap-10">
        {/* About */}
        {artist &&
          <About artist={artist} reviews={data?.data ?? null}/>
        }
      </div>

      {starStats &&
        <div className={`flex gap-2 items-stretch`}>
          <StarStatistics stats={starStats}/>
          {status === 'authenticated' &&
            <UserReviewPanel 
              item={artist} 
              itemId={artistId} 
              type="artist"
              review={review}
              setReview={setReview}
              setData={setData}
              setStarStats={setStarStats}
            />
          }
        </div>
      }

      {status === 'authenticated' && review &&
        <YourReviewSection
          review={review}
        />
      }

      {reviewsload &&
        <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
      }

      {data &&
        <>
          <Reviews data={data}/>
          {data.count > data.limit && (
            <Pagination data={data} fetchData={fetchData} />
          )}          
        </>
      }

    </div>
  )
}