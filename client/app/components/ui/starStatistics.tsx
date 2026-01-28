import StarStatisticsBar from "./StarStatisticsBar"
import StarRatingVisual from "./StarVisual"

export default function StarStatistics ({ 
  stats, filter = true, showTitle = true 
} : { 
  stats: StarCount[], 
  filter?: boolean,
  showTitle?: boolean
}) {

  const maxCount = Math.max(...stats.map(s => s.count))

  return (
    <div
      className="overflow-hidden rounded-lg border border-gray-500"
    >

      {showTitle &&
        <div
          className="flex justify-between px-2 py-1 bg-surface-elevated text-sm font-mono"
        >
          <p
            className="font-semibold"
          >
            Rating Breakdown
          </p>
          {filter &&
            <p
              className="text-gray-500"
            >
              (Click a rating to filter reviews)
            </p>
          }
        </div>
      }

      <table className="table-fixed w-full">
        <thead>
          <tr className="text-xs uppercase text-gray-400 bg-surface">
            <th 
              className="px-2 py-1 w-15 text-right"
            >
              Rating
            </th>
            <th className="px-2 py-1 text-left">Distribution</th>
            <th className="px-2 py-1 w-20">Reviews</th>
            <th className="px-1 py-1 w-35">Visual</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s, i) => (
            <tr
              key={i}
              className={`
                ${i % 2 === 0 ? "" : "bg-surface"}  
                px-2 py-1 
              `}
            >
              <td 
                className="text-right px-2 py-1 font-mono text-sm font-semibold interactive-button interactive-dark"
              >
                {s.rating}
              </td>
              <td className="px-2 py-1 ">
                <StarStatisticsBar
                  maxCount={maxCount}
                  stat={s}
                />
              </td>
              <td className="px-2 py-1 text-sm text-gray-500 text-center">{s.count}</td>
              <td className="px-2 py-1 flex justify-center items-center">
                <StarRatingVisual rating={s.rating}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}