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

export default function Artist ({
  params
} : {
  params: Promise<{artistId: string}>
}) {

  const { artistId } = use(params)
  const { data: session } = useSession()

  const [artist, setArtist] = useState<Artist | null>(null)
  const [reviews, setReviews] = useState<ReviewResponse | null>(null)
  const [avgRating, setAvgRating] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [artist, reviews] = await Promise.allSettled([
          await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
            params : {id : artistId}
          }),
          await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/artist`, {
            params: {id: artistId}
          })
        ])

        if (artist.status === "fulfilled") {
          setArtist(artist.value.data)
        } else {
          console.error("Artist fetch failed", artist.reason)
        }

        if (reviews.status === "fulfilled") {
          setReviews(reviews.value.data)
        } else {
          console.error("Reviews fetch failed", reviews.reason)
        }

      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <Nav/>
      <Container>
        <div className="mt-20 min-h-screen mb-5">
          
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
            {session && !isLoading &&
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
            {isLoading &&
              <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
            }
            {reviews &&
              <Reviews reviews={reviews.reviews}/>
            }

              
          </div>

        </div>
      </Container>
      <Footer/>
    </div>
  )
}