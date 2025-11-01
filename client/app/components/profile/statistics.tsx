import { Star } from "lucide-react"

export default function Statistics({ stats }: { stats: StarCount[] }) {
  const maxCount = Math.max(...stats.map(s => s.count))

  return (
    <div>
      {stats.map((stat) => (
        <div key={stat.rating} className="flex items-center gap-2 mb-2">
          <span 
            className="w-4 text-right mr-2 font-mono text-amber-500 font-bold text-lg hover:underline cursor-pointer" 
            onClick={() => alert(`alert show all ${stat.rating} star ratings`)}
          >
            {stat.rating}
          </span>
          <div className="flex-1 flex bg-gray-700 h-7 items-center pr-2">
            {stat.count !== 0 &&
              <div
                className="bg-teal-500 h-5 border-2 border-gray-300 transition-all"
                style={{
                  width: `${maxCount > 0 ? (stat.count / maxCount) * 100 : 0}%`,
                  backgroundColor: `hsl(${stat.rating * 25}, 85%, 45%)`, 
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
    </div>
  )
}
