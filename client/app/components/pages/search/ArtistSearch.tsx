import { useRouter } from "next/navigation"
import { ApiPageResponse } from "../../../lib/types/api"

export default function ArtistSearch ({
  data
} : {
  data: ArtistQuery
}) {

  const router = useRouter()

  if (!data) return

  return (
    <>
      {data.suggestions.map((s, i) => (
        <li key={s.id}
          className={`${i % 2 === 0 ? 'bg-gray-800 hover:bg-gray-800/80' : 'bg-gray-700 hover:bg-gray-700/80'}
            cursor-pointer p-2 flex gap-2 justify-between
          `}
          onClick={() => router.push(`/artist/${s.id}`)}
        >
          <div className="flex flex-col justify-between">
            <span className="font-mono font-bold">{s.name} </span>
            <span className="text-sm text-gray-500">{s.disambiguation}</span>
          </div>
          <div className="flex items-center">
            <span className="font-mono font-bold text-sm text-gray-500">{s.type}</span>
          </div>
        </li>
      ))}
    </>
  )
}