import { ReleaseGroup } from "@/app/lib/types/api"
import { table } from "console"
import { Image } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"

export default function DiscographyTable ({
  discography,
  active,
} : {
  discography: ReleaseGroup[]
  active: 'album' | 'single' | 'ep'
}) {

  const grouped = useMemo(() => {
    const map: Record<string, ReleaseGroup[]> = {}
    discography.forEach(rg => {
      const key = rg.type
      if(!map[key]) map[key] = []
      map[key].push(rg)
    })
    return map
  }, [])

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
                    <Link 
                      className="hover:underline flex rgs-center gap-1"
                      href={active === 'single' ? `/song/${rg.id}` : `/${active}/${rg.id}`}>
                      <Image className="text-gray-500 inline-block"/>
                      <p>{rg.title}</p>
                    </Link>
                  </td>
                  <td className="border border-white p-1">{rg.averageRating ? `${rg.averageRating}` : 'N/A'}</td>
                  <td className="border border-white p-1">{rg.totalReviews}</td>
                </tr>
              ))}
            </tbody>

          </table>
        
        </div>
      ))}
    </>
  )

}