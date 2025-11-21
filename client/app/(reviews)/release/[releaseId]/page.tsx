'use client'

import Reviews from "@/app/components/reviews/Reviews";
import ReviewBar from "@/app/components/reviews/ReviewBar";
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar";
import { useSession } from "next-auth/react";
import { use, useState } from "react"
import Tracklist from "@/app/components/pages/album/Tracklist";
import Statistics from "@/app/components/pages/profile/statistics";
import LoadingBox from "@/app/components/ui/loading/loadingBox";
import LoadingText from "@/app/components/ui/loading/LoadingText";
import RefreshPage from "@/app/components/ui/RefreshPage";
import useFetchRelease from "@/app/hooks/musicbrainz/useFetchRelease";
import Pagination from "@/app/components/ui/Pagination";
import TextContent from "@/app/components/pages/album/TextContent";

export default function AlbumPage ({
  params
} : {
  params: Promise<{releaseId : string}>
}) {

  const { releaseId } = use(params)
  const { data: session } = useSession()
  const [active, setActive] = useState('reviews')
  const {
    coverArt,
    album,
    loading,
    error,
    setData,
    data,
    fetchData
  } = useFetchRelease(releaseId)

  if (loading) {
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
    <div>
      <div className="flex justify-between">
        {/* Text content */}
        {data &&
          <TextContent
            album={album}
            reviews={data?.data}
            coverArt={coverArt}
            loading={loading}
          />
        }
      </div>

      {data?.data.starStats &&
        <div className={`
          border-t pt-3 mt-2 border-gray-500
          ${!session && 'pb-2 border-b mb-2'}
        `}>
          <Statistics stats={data?.data.starStats}/>
        </div>
      }

      {session && !loading && data && 
        <>
          <ReviewBar 
            item={album} 
            type="artist" 
            data={data} 
            setData={setData} 
          />
        </>
      }


      <ul className="flex list-none flex-wrap gap-4 text font-mono font-bold my-1 mb-2">
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
        {loading &&
          <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
        }
        {data &&
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
        {album &&
          <Tracklist album={album}/>
        }
        </>
      }

    </div>
  )
}