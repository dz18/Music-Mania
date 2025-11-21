import { ReleaseGroup } from "@/app/lib/types/api"
import axios from "axios"
import { table } from "console"
import { Image } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

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
      } finally {
        setLoadingMap(prev => ({ ...prev, [rg.id]: false }))
      }
    } else {
      router.push(`/release/${rg.id}`)
    }
  }

  return (
    <>
      {Object.entries(grouped).map(([typeName, releaseGroups]) => (
        <div className="mb-5" key={typeName}>
          <div className="p-1 bg-gray-800 text-center items-end font-mono border-1 border-b-0">
            <p>{typeName}</p>
          </div>
          <table className="table-auto w-full">
            <thead>
              <tr className="text-sm bg-gray-800">
                <th className="border border-y-white p-1 whitespace-nowrap">Release Date</th>
                <th className="border border-y-white p-1 whitespace-nowrap text-left">Title</th>
                <th className="border border-y-white p-1 whitespace-nowrap">Rating</th>
                <th className="border border-y-white p-1 whitespace-nowrap">Reviews</th>
              </tr>
            </thead>
            <tbody>
              {releaseGroups.map((rg, i) => (
                <tr key={rg.id} className={`${i % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}`}>
                            
                  <td className="border border-white p-1">
                    {rg.firstReleaseDate ? rg.firstReleaseDate : 'N/A'}
                  </td>
                  <td className="border border-white p-1 w-full">
                    <button 
                      className="hover:underline flex rgs-center gap-1"
                      onClick={() => handleClick(rg)}
                    >
                      <Image className="text-gray-500 inline-block"/>
                      <p>{rg.title}</p>
                    </button>
                  </td>
                  <td className="border border-white p-1 text-center">{rg.averageRating ? `${rg.averageRating}` : 'N/A'}</td>
                  <td className="border border-white p-1 text-center  ">{rg.totalReviews}</td>
                </tr>
              ))}
            </tbody>

          </table>
        
        </div>
      ))}
    </>
  )

}