import { Star } from "lucide-react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Statistics({ stats }: { stats: StarCount[] }) {
  const maxCount = Math.max(...stats.map(s => s.count))
  const router = useRouter()
  const pathname = usePathname()

  const [filterOn, setFilterOn] = useState(false)

  const searchParams = useSearchParams()
  const star = searchParams.get("star")
  const [currentStar, setCurrentStar] = useState<number | null>(null)
  useEffect(() => {
    const sp = searchParams.get("star")

    if (sp !== null) {
      setCurrentStar(Number(sp));
      setFilterOn(true);
    } else {
      setCurrentStar(null);
      setFilterOn(false);
    }
  }, [searchParams])

  const handleRatingRoute = (s: StarCount | null = null) => {

    const params = new URLSearchParams()
    if (s) {
      params.set("star", `${s.rating}`)
      setCurrentStar(Number(s.rating))
      setFilterOn(true)
    } else {
      setFilterOn(false)
      setCurrentStar(null)
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div>
      {stats.map((stat) => (
        <div key={stat.rating} className="flex items-center gap-2 mb-2">
          <span 
            className={`${currentStar && currentStar === stat.rating ? "font-bold text-amber-500" : "font-semibold"}
              w-4 text-right mr-2 font-mono text-lg hover:underline cursor-pointer` }
            onClick={() => handleRatingRoute(stat)}
          >
            {stat.rating}
          </span>
          <div className="flex-1 flex bg-gray-700 h-7 items-center pr-2">
            {stat.count !== 0 &&
              <div
                className="bg-teal-500 h-5 border-2 border-gray-300 transition-all"
                style={{
                  width: `${maxCount > 0 ? (stat.count / maxCount) * 100 : 0}%`,
                  backgroundColor: `hsl(${(stat.rating - 1) * 30}, 85%, 45%)`, 
                }}
              />
            }
          </div>
          <span className="w-10 text-center mx-1">
            {stat.count}
          </span>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={
                i < Math.floor(stat.rating)
                  ? "fill-amber-500 stroke-amber-500"
                  : "fill-gray-100 stroke-gray-100"
              }
            />
          ))}
        </div>
      ))}
      {star && (
        <button 
          className="text-sm font-bold text-teal-500 mt-2 cursor-pointer"
          onClick={() => handleRatingRoute(null)}
        >
          Reset Filters
        </button>
      )}
    </div>
  )
}
