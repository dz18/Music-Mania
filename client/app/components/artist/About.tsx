import { Artist } from "@/app/lib/types/artist"
import { Star } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import ExternalResources from "./ExternalResources"
import { ReviewResponse } from "@/app/lib/types/api"

export default function About ({
  artist,
  reviews
} : {
  artist: Artist | null
  reviews: ReviewResponse | null
}) {

  const pathname = usePathname()

  const [aliases, setAliases] = useState<string[]>([])
  useEffect(() => {
    if (artist) {
      setAliases(artist.aliases.map((alias => alias.name)))
    }
  }, [artist])

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="font-mono flex justify-between">
        <div>
          <p className="text-2xl font-bold">{artist?.name}</p>
          <p className="text-sm">{artist?.disambiguation}</p>
        </div>
        <div>
          <p className="flex items-center gap-2">
            <span className="font-bold text-xl">{reviews?.avgRating}</span> / 5.0 <Star size={18} className="fill-amber-500 stroke-0"/>
          </p>
        </div>
      </div>
      {artist?.lifeSpan.begin !== null && artist?.lifeSpan.begin !== null &&
        <div>
          <p className="text-sm text-gray-500 font-bold">
            {artist?.type === 'Person' ? 'Born' : 'Formed'}
          </p>
          <p>{artist?.lifeSpan.begin}</p>
        </div>
      }
      {artist?.lifeSpan.ended &&
        <div>
          <p className="text-sm text-gray-500 font-bold">
            {artist?.type === 'Person' ? 'Died' : 'Disbanded'}
          </p>
          <p>{artist.lifeSpan.end}</p>
        </div>
      }
      {artist?.membersOfband.length !== 0 &&
        <div>
          <p className="text-sm text-gray-500 font-bold">
            {artist?.type === 'Person' ? 'Member of' : 'Members'}
          </p>
          {artist?.membersOfband.map((member, i) => (
            <span
              key={i} 
              onClick={() => alert(member.artist.id)}
            >
              <span  
                className="hover:underline cursor-pointer"
              >
                {member.artist.name}
              </span>
              {i < artist.membersOfband.length - 1 && ', '}
            </span>
          ))}
        </div>
      }
      {aliases.length !== 0 &&
        <div>
          <p className="text-sm text-gray-500 font-bold">Aliases</p>
          <p>{aliases.join(', ')}</p>
        </div>
      }
      {artist?.genres.length !== 0 &&
        <div>
          <p className="text-sm text-gray-500 font-bold">Genres</p>
          {artist?.genres.map((genre, i) => (
            <span 
              key={genre.id}
              onClick={() => alert(genre.id)}
            > 
              <span 
                className="hover:underline cursor-pointer"
              >
                {genre.name}
              </span>
              {i < artist.genres.length - 1 && ', '}
            </span>
          ))}
        </div>
      }
      {artist?.urls.length !== 0 &&
        <ExternalResources artist={artist}/>
      }
      <Link href={`${pathname}/discography`} className="inline-flex text-teal-500 font-bold hover:underline">
        See discography
      </Link>
    </div>
  )
}