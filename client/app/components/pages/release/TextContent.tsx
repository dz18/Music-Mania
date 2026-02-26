import { msToHMS } from "@/app/hooks/timeMs"
import { Release, ReviewResponse } from "@/app/lib/types/api"
import { ImageOff, Loader, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"


export default function TextContent ({
  release,
  reviews,
  coverArt,
  loading
} : {
  release: Release | undefined
  reviews: ReviewResponse | undefined
  coverArt: string | undefined
  loading: boolean
}) {

  const router = useRouter()

  const totalLengthMs = release?.media.reduce(
    (releaseSum, m) =>
      releaseSum +
      m.tracks.reduce(
        (discSum, t) => discSum + (t.length ?? 0),
        0
      ),
    0
  ) ?? 0

  const { hours, minutes, seconds } = msToHMS(totalLengthMs)

  return (
    <>
      <div className="flex-1 flex flex-col gap-4 font-mono text-sm mr-4">
      
        <div className="flex justify-between">
          <p className="font-bold text-xl">{release?.title}</p>
          <div className="gap-2 flex font-bold text-lg items-center">
            <p>{reviews?.avgRating}</p>
            <p>/</p>
            <p>5.0</p>
            <Star className="fill-amber-500 stroke-0"/>
          </div>
        </div>

        <div className="flex flex-col">
          <p className="font-bold text-sm text-gray-500">
            Made by
          </p>
          <div className="flex flex-wrap gap-1">
          {release?.artistCredit.map((artist, i) => (
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
          <p>{release?.date}</p>
        </div>

        <div className="flex flex-col">
          <p className="font-bold text-sm text-gray-500">Type</p>
          <p>{release?.type.join(' + ')}</p>
        </div>

        <div className="flex flex-col">
          <p className="font-bold text-sm text-gray-500">Genre</p>
          <div className="flex flex-wrap gap-1">
          {release?.genres.map((genre, i) => (
            <span 
              key={genre.id}
              onClick={() => alert(genre.id)}
            > 
              <span 
                className="hover:underline cursor-pointer"
              >
                {genre.name}
              </span>
              {i < release.genres.length - 1 && ', '}
            </span>
          ))}
          </div>
        </div>
        
        <div className="flex flex-col">
          <p className="font-bold text-sm text-gray-500">Total Length</p>
          <p>{hours !== 0 && `${hours} hrs`} {minutes} mins {!hours && `${seconds} secs`}</p>
        </div>

        <div className="flex flex-col">
          <p className="font-bold text-sm text-gray-500">Language</p>
          {release?.language && 
            new Intl.DisplayNames(['en'], { type: 'language' }).of(release?.language)
          }
        </div>

      </div>

      {/* Image */}
      <div>
      {coverArt ? (
        <img src={coverArt} className="w-100 shrink-0" />
      ) : (
        <div className="w-100 h-100 flex items-center justify-center bg-gray-800">
          {!loading ? <ImageOff size={50} className="text-gray-500"/> : <Loader size={50} className="animate-spin text-gray-500 "/>}
        </div>
      )}
      </div>
    </>
  )
}