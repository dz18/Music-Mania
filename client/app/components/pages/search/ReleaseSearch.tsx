import { useRouter } from "next/navigation"
import { ApiPageResponse } from "../../../lib/types/api"

export default function ReleaseSearch ({
  data
} : {
  data: ReleaseQuery
}) {

  const router = useRouter()

  if (!data) return

  return (
    <>
      {data.suggestions.map((s, i) => (
        <li key={s.id}
          className={`
            interactive-button interactive-dark p-2 flex gap-2 justify-between border-t border-gray-500
          `}
          onClick={() => router.push(`/release/${s.id}`)}
        >
          <div className="flex justify-between flex-col">
            <span className="font-mono font-bold">{s.title} </span>
            <span className="text-gray-400 text-sm"> {s.artistCredit?.map(ac => `${ac.name}${ac.joinphrase || ""}`)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono font-semibold text-sm text-gray-500">{s.primaryType}</span>
            <span className="font-mono text-sm text-gray-500">{s.firstReleaseDate}</span>
          </div>
        </li>
      ))}
    </>
  )
}