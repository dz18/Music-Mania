'use client'

import Reviews from "@/app/components/reviews/Reviews";
import ReviewBar from "@/app/components/reviews/ReviewBar";
import Container from "@/app/components/ui/Container";
import Footer from "@/app/components/ui/Footer";
import IndeterminateLoadingBar from "@/app/components/ui/IndeterminateLoadingBar";
import Nav from "@/app/components/ui/NavigationBar";
import { Release, ReviewResponse } from "@/app/lib/types/api";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react"
import Tracklist from "@/app/components/album/Tracklist";
import TextContent from "@/app/components/album/TextContent";

export default function AlbumPage ({
  params
} : {
  params: Promise<{releaseId : string}>
}) {

  const { releaseId } = use(params)
  const { data: session } = useSession()
  const [coverArt, setCoverArt] = useState('')
  const [album, setAlbum] = useState<Release | null>(null)
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState<ReviewResponse | null>(null)
  const [active, setActive] = useState('reviews')
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [album, reviews] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getRelease`, {
            params: {releaseId: releaseId}
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/release`,{
            params: {id: releaseId}
          })
        ])
        setCoverArt(album.data.coverArtUrl)
        setAlbum(album.data.album)
        setReviews(reviews.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <Nav/>
      <Container>
        <div className="min-w-full min-h-screen mt-20 mb-10 flex flex-col">
          <div className="flex justify-between">
            {/* Text content */}
            <TextContent
              album={album}
              reviews={reviews}
              coverArt={coverArt}
              loading={loading}
            />
          </div>

          {session && 
            <ReviewBar item={album} type="release" reviews={reviews?.reviews} setReviews={setReviews}/>
          }

          <ul className="flex list-none flex-wrap gap-4 text font-mono font-bold my-1 mb-2">
            <li 
              className={`px-2 py-1 border-b-2 cursor-pointer ${active === 'reviews' ? 'text-teal-300  bg-teal-800' : "border-transparent"}`}
              onClick={() => setActive('reviews')}
            >Reviews</li>
            <li
              className={`px-2 py-1 border-b-2 cursor-pointer ${active === 'tracklist' ? 'text-teal-300  bg-teal-800' : "border-transparent"}`}
              onClick={() => setActive('tracklist')}
            >Tracklist</li>
          </ul>

          {active === 'reviews' &&
            <>
            {loading &&
              <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
            }
            {reviews &&
              <Reviews reviews={reviews.reviews}/>
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
      </Container>
      <Footer/>
    </div>
  )
}