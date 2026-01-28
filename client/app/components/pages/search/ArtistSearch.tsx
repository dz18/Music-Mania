import { useRouter } from "next/navigation"

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
          className={`
            ${i % 2 === 0 ? "bg-surface" : "bg-transparent"}
            p-2 flex gap-2 justify-between 
                  border-t border-white/5
            interactive-button interactive-dark
          `}
          onClick={() => router.push(`/artist/${s.id}`)}
        >
          <div className="flex flex-col justify-between">
            <span className="font-mono font-bold">{s.name} </span>
            <span className="text-sm text-gray-400">{s.disambiguation}</span>
          </div>
          <div className="flex items-center">
            <span className="font-mono font-bold text-sm text-gray-500">{s.type}</span>
          </div>
        </li>
      ))}
    </>
  )
}