import { ReleaseGroup } from "@/app/lib/types/api"
import axios from "axios"
import { table } from "console"
import { Image } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import TracklistRatingsBlock from "../release/TracklistRatingsBlock"
import DiscographyRatingBlock from "./DiscographyRatingBlock"

export default function DiscographyTable ({
  discography,
  active,
} : {
  discography: ReleaseGroup[]
  active: 'album' | 'single' | 'ep'
}) {

  const router = useRouter()
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  const grouped = useMemo(() => {
    const map: Record<string, ReleaseGroup[]> = {}
    discography.forEach(rg => {
      const key = rg.type
      if(!map[key]) map[key] = []
      map[key].push(rg)
    })
    return map
  }, [])

  const handleClick = async (rg: ReleaseGroup) => {
    if (loadingMap[rg.id]) return
    setLoadingMap(prev => ({ ...prev, [rg.id]: true }))

    if (active === 'single') {
      try {
        const single = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/findSingleId`, {
          params: {rgId : rg.id}
        })
        
        router.push(`/song/${single.data}`)
      } catch (error) {
        console.error(error)
      }
    } else {
      router.push(`/release/${rg.id}`)
    }
    setLoadingMap(prev => ({ ...prev, [rg.id]: false }))
  }

  return (
    <>
      {Object.entries(grouped).map(([typeName, releaseGroups]) => (
        <div className="mb-6 rounded-lg overflow-hidden border border-gray-500" key={typeName}>

          <div className="px-2 py-1 bg-surface-elevated text-center font-mono">
            <p className="font-semibold text-sm tracking-wide">{typeName}</p>
          </div>

          <table className="table-auto w-full">
          <thead className="bg-surface">
            <tr className="text-xs uppercase tracking-wide text-gray-400">
              <th className="px-3 py-2 w-20">Release</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-center w-20">Reviews</th>
              <th className="px-3 py-2 text-center w-20">Rating</th>
            </tr>
          </thead>

          <tbody>
            {releaseGroups.map((rg, i) => (
              <tr
                key={rg.id}
                onClick={() => handleClick(rg)}
                className={`
                  border-t border-white/5 text-sm
                  ${i % 2 === 0 ? 'bg-surface-elevated/50' : 'bg-surface'}
                  interactive-dark interactive-button
                `}
              >
                <td className="px-3 py-2 text-gray-500">
                  {rg.firstReleaseDate ?? 'N/A'}
                </td>

                <td 
                  className="px-3 py-2 flex items-center gap-2"
                >
                  <Image className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{rg.title}</span>
                </td>

                <td className="px-3 py-2 text-center text-gray-500">
                  {rg.totalReviews !== null 
                    ? rg.totalReviews
                    : 'N/A'
                  }
                </td>
                
                <td
                  className={`
                    px-4 py-2 w-20 text-center font-semibold
                    ${rg?.avgRating === null ? "text-gray-600" : "text-white"}
                    rounded-md p-1
                  `}
                >
                  <DiscographyRatingBlock 
                    releaseGroup={rg}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        
        </div>
      ))}
    </>
  )

}