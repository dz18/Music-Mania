'use client'

import Reviews from "@/app/components/reviews/Reviews";
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar";
import LoadingBox from "@/app/components/ui/loading/loadingBox";
import LoadingText from "@/app/components/ui/loading/LoadingText";
import Pagination from "@/app/components/ui/Pagination";
import RefreshPage from "@/app/components/ui/RefreshPage";
import useFetchSong from "@/app/hooks/musicbrainz/useFetchSong";
import { ImageOff, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StarStatistics from "../../ui/starStatistics";
import UserReviewPanel from "../../reviews/UserReviewPanel";
import { useState } from "react";
import { ReviewTypes } from "@/app/lib/types/api";
import YourReviewSection from "../../reviews/YourReview";
import useFetchUserReview from "@/app/hooks/api/reviews/useFetchUserReview";

export default function SongPage ({
  songId,
} : {
  songId: string,
}) {

  const { status } = useSession()
  const router = useRouter()
  
  const {
    song,
    coverArtUrl,
    songLoad,
    reviews,
    reviewsLoad,
    error,
    starStats,
    refetchReviews,
    refetchsong
  } = useFetchSong(songId)

  const { userReview } = useFetchUserReview(song?.workId || song?.id, 'song')

  if (songLoad) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <LoadingText text="Searching for Song"/>
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
        func={async () => { await refetchsong()}}
        title={'Song Page'}
        loading={songLoad}
        note={error.message}
      />
    )
  }

  console.log(userReview)
  
  return (
    <div className="flex flex-col gap-2">

      <div className="flex justify-between">
        <div className="flex-1 flex flex-col gap-4 font-mono text-sm mr-4">
          <div>
            <p className="text-xl font-mono font-bold">{song?.title}</p>
            <p className="text-sm text-gray-500 font-mono">
              {song?.artistCredit.map(a => (
                <span key={a.artist.id}>
                  <span
                    className="hover:underline cursor-pointer"
                    onClick={() => router.push(`/artist/${a.artist.id}`)}
                  >
                    {a.name}
                  </span>
                  <span>
                    {a.joinphrase}
                  </span>
                </span>
              ))}
            </p>
          </div>

          {song?.partOf.length !== 0 &&
            song?.partOf?.map(p => {
              return (
                <div className="text-sm" key={p.id}>
                  <p className="text-gray-500 font-bold">{p.type}</p>
                  <p className="hover:underline cursor-pointer"
                    onClick={() => router.push(`/release/${p.id}`)}
                  >
                    {p.name}
                  </p>
                </div>
              )
            })
          }

          <div className="text-sm">
            <p className="font-bold text-gray-500">Released</p>
            <p>{song?.firstReleaseDate}</p>
          </div>

          {song?.length &&
            <div className="text-sm">
              <p className="font-bold text-gray-500">length</p>
              <span className="flex gap-1">
                <p className="">{Math.floor(song.length / 60000)} mins {Math.floor((song.length / 1000) % 60)} secs</p>
              </span>
            </div>
          }

          {song?.genres.length !== 0 &&
            <div className="text-sm">
              <p className="font-bold text-gray-500">Genres</p>
              <span className="gap-1 flex flex-wrap">
                {song?.genres.map((g, i) => 
                  <p key={g.id} className="hover:underline cursor-pointer" onClick={() => alert(g.id)}>{i+1 !== song.genres.length ? `${g.name},` : `${g.name}`}</p>
                )}
              </span>
            </div>
          }
        </div>
        
        {/* Image */}
        <div>
        {coverArtUrl ? (
          <img src={coverArtUrl} className="w-100 shrink-0" />
        ) : (
          <div className="w-100 h-100 flex items-center justify-center bg-gray-800">
            {!songLoad ? <ImageOff size={50} className="text-gray-500"/> : <Loader size={50} className="animate-spin text-gray-500 "/>}
          </div>
        )}
        </div>

      </div>

      {starStats &&
        <div className={`flex gap-2 items-stretch`}>
          <StarStatistics stats={starStats}/>
          {status === 'authenticated' && song?.workId &&
            <UserReviewPanel 
              item={song} 
              itemId={song.workId} 
              type="song"
              coverArtUrl={coverArtUrl}
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