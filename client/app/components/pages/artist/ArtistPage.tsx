'use client'

import About from "@/app/components/pages/artist/About"
import Reviews from "@/app/components/reviews/Reviews"
import ReviewBar from "@/app/components/reviews/ReviewBar"
import type { Artist } from "@/app/lib/types/artist"
import { useSession } from "next-auth/react"
import { use } from "react"
import Statistics from "@/app/components/ui/statistics"
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar"
import LoadingBox from "@/app/components/ui/loading/loadingBox"
import RefreshPage from "@/app/components/ui/RefreshPage"
import LoadingText from "@/app/components/ui/loading/LoadingText"
import useFetchArtist from "@/app/hooks/musicbrainz/useFetchArtist"
import Pagination from "@/app/components/ui/Pagination"

export default function ArtistPage ({
  artistId,
  star
} : {
  artistId: string,
  star: number | null
}) {

  const { data: session } = useSession()
  const { 
    artist, reviewsload, artistLoad, fetchData, 
    error, data, setData
  } = useFetchArtist(artistId, star)

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
    <div>
      <div className="gap-10">

        <div className="flex gap-10">
          {/* About */}
          {artist &&
            <About artist={artist} reviews={data?.data ?? null}/>
          }
        </div>

        {data?.data.starStats &&
          <div className={`
            border-t pt-3 mt-2 border-gray-500
            ${!session && 'pb-2 border-b mb-2'}
          `}>
            <Statistics stats={data.data.starStats}/>
          </div>
        }

        {/* Make a Review */}
        {session && !reviewsload && data && 
          <>
            <ReviewBar 
              item={artist} 
              type="artist" 
              data={data} 
              setData={setData} 
            />
          </>
        }

        <div className="font-mono flex mt-2 justify-between items-center">
        </div>
        {reviewsload &&
          <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
        }
        {data &&
          <>
            <Reviews data={data}/>
            <Pagination data={data} fetchData={fetchData}/>
          </>

        }

          
      </div>
    </div>
  )
}