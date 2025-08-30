import { Album, ReviewResponse } from "@/app/lib/types/api"
import { Review } from "@/app/lib/types/artist"
import { ImageOff, Loader, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"


export default function TextContent ({
  album,
  reviews,
  coverArt,
  loading
} : {
  album: Album | null
  reviews: ReviewResponse | null
  coverArt: string
  loading: boolean
}) {

  const router = useRouter()

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
    <>
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
    </>
  )
}