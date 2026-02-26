'use client'

import About from "@/app/components/pages/artist/About"
import Reviews from "@/app/components/reviews/Reviews"
import { useSession } from "next-auth/react"
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar"
import LoadingBox from "@/app/components/ui/loading/loadingBox"
import RefreshPage from "@/app/components/ui/RefreshPage"
import LoadingText from "@/app/components/ui/loading/LoadingText"
import useFetchArtist from "@/app/hooks/musicbrainz/useFetchArtist"
import Pagination from "@/app/components/ui/Pagination"
import StarStatistics from "../../ui/starStatistics"
import UserReviewPanel from "../../reviews/UserReviewPanel"
import YourReviewSection from "../../reviews/YourReview"
import useFetchUserReview from "@/app/hooks/musicbrainz/useFetchUserReview"

export default function ArtistPage ({
  artistId,
} : {
  artistId: string,
}) {

  const { status } = useSession()
  const { 
    artist, artistLoad,
    reviews, reviewsLoad,
    error, starStats, 
    refetchReviews, refetchArtists
  } = useFetchArtist(artistId)

  const {userReview} = useFetchUserReview(artistId, 'artist')

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
        func={async () => { await refetchArtists ()}}
        title={'Artist Page'}
        loading={artistLoad}
        note={error.message}
      />
    )
  }
  
  return (
    <div className="flex flex-col gap-2">

      <div className="flex gap-10">
        {/* About */}
        {artist &&
          <About artist={artist} reviews={reviews?.data ?? null}/>
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
            />
          }
        </div>
      }

      {status === 'authenticated' && userReview &&
        <YourReviewSection
          review={userReview}
        />
      }

      {reviewsLoad &&
        <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
      }

      {reviews &&
        <>
          <Reviews data={reviews}/>
          {reviews.count > reviews.limit && (
            <Pagination totalPages={reviews.pages}/>
          )}          
        </>
      }

    </div>
  )
}