'use client'

import Reviews from "@/app/components/reviews/Reviews";
import ReviewBar from "@/app/components/reviews/ReviewBar";
import Container from "@/app/components/ui/Container";
import Footer from "@/app/components/ui/Footer";
import IndeterminateLoadingBar from "@/app/components/ui/IndeterminateLoadingBar";
import Nav from "@/app/components/ui/NavigationBar";
import { Album, ReviewResponse } from "@/app/lib/types/api";
import axios from "axios";
import { Axis3D, DiscAlbum, ImageOff, Loader, Star, StarHalf } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react"

export default function AlbumPage ({
  params
} : {
  params: Promise<{albumId : string}>
}) {

  const { albumId } = use(params)
  const { data: session, update} = useSession()
  const router = useRouter()
  const [coverArt, setCoverArt] = useState('')
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState<ReviewResponse | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [album, reviews] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getAlbum`, {
            params: {albumId: albumId}
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`,{
            params: {type: 'RELEASE', id: albumId}
          })
        ])
        console.log(album.data)
        console.log(reviews.data)
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

  const totalLength = useMemo(() => {
    return Math.floor(((album?.tracks.reduce((sum, track) => sum + (track.length || 0), 0) ?? 0)/1000)/60)
  }, [album])

  return (
    <div>
      <Nav/>
      <Container>
        <div className="min-w-full min-h-screen mt-20 mb-10 flex flex-col">
          <div className="flex justify-between">
            {/* Text content */}
            <div className="flex-1 flex flex-col gap-4 font-mono text-sm mr-4">

              <div className="flex justify-between">
                <p className="font-bold text-xl">{album?.title}</p>
                <div className="gap-2 flex font-bold text-lg items-center">
                  <p>{reviews?.avgRating}</p>
                  <p>/</p>
                  <p>5.0</p>
                  <Star className="fill-amber-500 stroke-0"/>
                </div>
              </div>

              <div className="flex gap-2 flex-col">
                <p className="font-bold text-sm text-gray-500">
                  Made by
                </p>
                <div className="flex flex-wrap gap-1">
                {album?.artistCredit.map((artist, i) => (
                  <p key={i} 
                    onClick={() => router.push(`/artist/${artist.artist.id}`)}
                    className="cursor-pointer hover:underline"
                  >
                    {`${artist.name}${artist.joinphrase}`}
                  </p>
                ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-sm text-gray-500">Released</p>
                <p>{album?.date}</p>
              </div>

              <div className="flex gap-2 flex-col">
                <p className="font-bold text-sm text-gray-500">Type</p>
                <p>{album?.type.join(' + ')}</p>
              </div>

              <div className="flex gap-2 flex-col">
                <p className="font-bold text-sm text-gray-500">Genre</p>
                <div className="flex flex-wrap gap-1">
                {album?.genres.map((genre, i) => (
                  <span 
                    key={genre.id}
                    onClick={() => alert(genre.id)}
                  > 
                    <span 
                      className="hover:underline cursor-pointer"
                    >
                      {genre.name}
                    </span>
                    {i < album.genres.length - 1 && ', '}
                  </span>
                ))}
                </div>
              </div>
              
              <div className="flex gap-2 flex-col">
                <p className="font-bold text-sm text-gray-500">Total Length</p>
                <p>{totalLength} mins</p>
              </div>

              <div className="flex gap-2 flex-col">
                <p className="font-bold text-sm text-gray-500">Language</p>
                {album?.language && 
                  new Intl.DisplayNames(['en'], { type: 'language' }).of(album?.language)
                }
                <p>
                </p>
              </div>

            </div>

            {/* Image */}
            <div>
            {coverArt ? (
              <img src={coverArt} className="w-100 flex-shrink-0" />
            ) : (
              <div className="w-100 h-100 flex items-center justify-center bg-gray-800">
                {!loading ? <ImageOff size={50} className="text-gray-500"/> : <Loader size={50} className="animate-spin text-gray-500 "/>}
              </div>
            )}
            </div>
          </div>

          {session && 
            <ReviewBar item={album} type="release"/>
          }
          
          {loading &&
            <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
          }
          {reviews &&
            <Reviews reviews={reviews.reviews}/>
          }

        </div>
      </Container>
      <Footer/>
    </div>
  )
}