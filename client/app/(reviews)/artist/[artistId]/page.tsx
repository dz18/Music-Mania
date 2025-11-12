'use client'

import About from "@/app/components/artist/About"
import Reviews from "@/app/components/reviews/Reviews"
import ReviewBar from "@/app/components/reviews/ReviewBar"
import Container from "@/app/components/ui/Container"
import Footer from "@/app/components/ui/Footer"
import Nav from "@/app/components/ui/NavigationBar"
import { ReviewResponse } from "@/app/lib/types/api"
import type { Artist } from "@/app/lib/types/artist"
import axios from "axios"
import { useSession } from "next-auth/react"
import { use, useEffect, useState } from "react"
import Statistics from "@/app/components/profile/statistics"
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar"
import fetchArtist from "@/app/hooks/musicbrainz/fetchArtist"
import LoadingBox from "@/app/components/ui/loading/loadingBox"
import RefreshPage from "@/app/components/ui/RefreshPage"
import { fetchData } from "next-auth/client/_utils"

export default function Artist ({
  params
} : {
  params: Promise<{artistId: string}>
}) {

  const { artistId } = use(params)
  const { data: session } = useSession()
  const { artist, reviews, loading, setReviews, fetchData } = fetchArtist(artistId)

  console.log(loading)

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <LoadingBox className="w-100 h-8"/>
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

  if (!artist) {
    return (
      <RefreshPage
        func={fetchData}
        title={'Artist Page'}
        loading={loading}
        note="Musicbrainz API Data fetched failed or Artist ID doesn't exist"
      />
    )
  }

  return (
    <div>
      <div className="gap-10">

        <div className="flex gap-10">
          {/* About */}
          <About artist={artist} reviews={reviews}/>

        </div>

        {reviews?.starStats &&
          <div className={`
            border-t pt-3 mt-2 border-gray-500
            ${!session && 'pb-2 border-b mb-2'}
          `}>
            <Statistics stats={reviews.starStats}/>
          </div>
        }

        {/* Make a Review */}
        {session && !loading &&
          <>
            <ReviewBar 
              item={artist} 
              type="artist" 
              reviews={reviews?.reviews} 
              setReviews={setReviews} 
            />
          </>
        }

        <div className="font-mono flex mt-2 justify-between items-center">
        </div>
        {loading &&
          <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
        }
        {reviews &&
          <Reviews reviews={reviews.reviews}/>
        }

          
      </div>
    </div>
  )
}