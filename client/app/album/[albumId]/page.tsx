'use client'

import Reviews from "@/app/components/reviews/Reviews";
import ReviewBar from "@/app/components/reviews/ReviewBar";
import Container from "@/app/components/ui/Container";
import Footer from "@/app/components/ui/Footer";
import IndeterminateLoadingBar from "@/app/components/ui/IndeterminateLoadingBar";
import Nav from "@/app/components/ui/NavigationBar";
import { Album, ReviewResponse } from "@/app/lib/types/api";
import axios from "axios";
import { ImageOff, Loader, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react"

export default function AlbumPage ({
  params
} : {
  params: Promise<{albumId : string}>
}) {

  const { albumId } = use(params)
  const { data: session } = useSession()
  const router = useRouter()
  const [coverArt, setCoverArt] = useState('')
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState<ReviewResponse | null>(null)
  const [active, setActive] = useState('reviews')
  
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
    return (album?.tracks.reduce((sum, track) => sum + (track.length || 0), 0) ?? 0) / 1000
  }, [album])

  const hours = useMemo(() => {
    return Math.floor(totalLength / 3600)
  }, [totalLength])

  const minutes = useMemo(() => {
    return Math.floor((totalLength % 3600) / 60)
  }, [totalLength])

  const seconds = useMemo(() => {
    return Math.floor(totalLength % 60)
  }, [totalLength])

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
                <p>{hours !== 0 && `${hours} hrs`} {minutes} mins {!hours && `${seconds} secs`}</p>
              </div>

              <div className="flex gap-2 flex-col">
                <p className="font-bold text-sm text-gray-500">Language</p>
                {album?.language && 
                  new Intl.DisplayNames(['en'], { type: 'language' }).of(album?.language)
                }
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

          <ul className="flex list-none flex-wrap gap-4 text font-mono font-bold my-1">
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
              <div>
                <p className="font-bold text-xl mb-2">{album.trackCount} {album.trackCount === 1 ? 'Track' : 'Tracks'}</p>
                <table className="border-1 w-full">
                  <thead>
                    <tr className="bg-gray-800 border-b border-">
                      <th className="p-1">Pos.</th>
                      <th className="text-left">Title</th>
                      <th className="">length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {album.tracks.map((track, i) => (
                      <tr
                        key={track.id}
                        className={`${i % 2 === 0 ? 'bg-gray-700 hover:bg-gray-700/80' : 'bg-gray-800 hover:bg-gray-800/80'} border-b border-white group `}
                        onClick={() => alert(track.id)}
                      >
                        <td className="px-3 py-2 text-right text-gray-400">{track.position}.</td>
                        <td className="px-3 py-2 flex gap-1 cursor-pointer">
                          <p 
                            className="font-semibold truncate group-hover:underline cursor-pointer" 
                          >{track.title}</p>
                          {track["artist-credit"].length > 1 &&
                            <p className="text-gray-300 text-sm items-end flex truncate"> ft. 
                              {track["artist-credit"].map((artist, i) => (
                                i !== 0 && `${artist.name} ${artist.joinphrase}` 
                              ))}
                            </p>
                          }
                        </td>
                        <td className="px-3 py-2">{track.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
            </>
          }

        </div>
      </Container>
      <Footer/>
    </div>
  )
}