'use client'

import About from "@/app/components/artist/About"
import ArtistReview from "@/app/components/artist/review"
import ReviewBar from "@/app/components/reviews/ReviewBar"
import Container from "@/app/components/ui/Container"
import Footer from "@/app/components/ui/Footer"
import IndeterminateLoadingBar from "@/app/components/ui/IndeterminateLoadingBar"
import Nav from "@/app/components/ui/NavigationBar"
import { ReviewResponse } from "@/app/lib/types/api"
import type { Artist } from "@/app/lib/types/artist"
import axios from "axios"
import { Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import { use, useEffect, useState } from "react"

export default function Artist ({
  params
} : {
  params: Promise<{artistId: string}>
}) {

  const { artistId } = use(params)
  const { data: session } = useSession()

  const [artist, setArtist] = useState<Artist | null>(null)
  const [reviews, setReviews] = useState<ReviewResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [artist, reviews] = await Promise.allSettled([
          await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
            params : {id : artistId}
          }),
          await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
            params: {type: 'ARTIST', id: artistId}
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
              <About artist={artist} avgRating={reviews?.avgRating ?? 0}/>

            </div>

            {/* Make a Review */}
            {session && !isLoading &&
              <>
                <ReviewBar item={artist} type="artist"/>
              </>
            }

            <div className="font-mono flex mt-2 justify-between items-center">
            {!isLoading ? 
              <p className="text-xl font-bold mb-2">{reviews?.reviews.length} {reviews?.reviews.length === 1 ? 'Review' : 'Reviews'}</p>  
            : 
              <p className="text-xl font-bold mb-2 text-gray-500 flex items-center gap-1">
                <Loader className="animate-spin" size={18}/> Loading Reviews
              </p>
            }
            </div>
            {isLoading &&
              <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
            }
            {reviews &&
              <ArtistReview reviews={reviews.reviews}/>
            }

              
          </div>

        </div>
      </Container>
      <Footer/>
    </div>
  )
}