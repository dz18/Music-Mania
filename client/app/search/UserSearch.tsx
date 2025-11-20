import { useRouter } from "next/navigation"
import { ApiPageResponse } from "../lib/types/api"

export default function UserSearch ({
  data
} : {
  data: UserQuery
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
          onClick={() => router.push(`/profile/${s.id}`)}
        >
          <div className="flex gap-2">
            <img src={s.avatar ?? './default-avatar.jpg'} className="w-12" />
            <div className="flex flex-col">
              <span className="font-mono font-bold">{s.username} </span>
              <span className="text-gray-500 text-sm">Joined {new Date(s.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </li>
      ))}
    </>
  )
}