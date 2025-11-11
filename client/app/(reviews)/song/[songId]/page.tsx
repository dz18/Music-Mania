'use client'

import Statistics from "@/app/components/profile/statistics";
import ReviewBar from "@/app/components/reviews/ReviewBar";
import Reviews from "@/app/components/reviews/Reviews";
import Container from "@/app/components/ui/Container";
import Footer from "@/app/components/ui/Footer";
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar";
import Nav from "@/app/components/ui/NavigationBar";
import { ReviewResponse } from "@/app/lib/types/api";
import type { Song } from "@/app/lib/types/song";
import axios from "axios";
import { ImageOff, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

export default function Song ({
  params
} : {
  params: Promise<{ songId: string }>
}) {

  const { songId } = use(params)
  const { data: session } = useSession()
  const router = useRouter()

  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(false)
  const [coverArt, setCoverArt] = useState('')
  const [reviews, setReviews] = useState<ReviewResponse | null>(null)
  

  useEffect(() => {
    
    const fetchData = async () => {
      try {

        const [songResult, reviews] = await  Promise.allSettled([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getSong`, {
            params: { songId }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/song`,{
            params: { id: songId }
          })
        ])

        if (songResult.status === 'fulfilled') {
          console.log(songResult.value.data.song)
          setSong(songResult.value.data.song)
          setCoverArt(songResult.value.data.coverArtUrl)
        } else {
          console.error("Failed:", songResult.reason)
        }

        if (reviews.status === 'fulfilled') {
          setReviews(reviews.value.data)
        } else {
          console.error("Failed:", reviews.reason)
        }

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
        <div className="min-h-screen mt-20">

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
            {coverArt ? (
              <img src={coverArt} className="w-100 flex-shrink-0" />
            ) : (
              <div className="w-100 h-100 flex items-center justify-center bg-gray-800">
                {!loading ? <ImageOff size={50} className="text-gray-500"/> : <Loader size={50} className="animate-spin text-gray-500 "/>}
              </div>
            )}
            </div>

          </div>

          {reviews?.starStats &&
            <div className={`
              border-t pt-3 mt-2 border-gray-500
              ${!session && 'pb-2 border-b mb-2'}
            `}>
              <Statistics stats={reviews.starStats}/>
            </div>
          }

          {session &&
            <ReviewBar item={song} type="song" reviews={reviews?.reviews} setReviews={setReviews} coverArtUrl={coverArt}/>
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