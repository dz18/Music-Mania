import { useRouter } from "next/navigation"
import { ApiPageResponse } from "../../../lib/types/api"

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
          className={`
            interactive-button interactive-dark p-2 flex gap-2 justify-between border-t border-gray-500
          `}
          onClick={() => router.push(`/profile/${s.id}`)}
        >
          <div className="flex gap-2">
            <img 
              src={`${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${s.id}?v=${Date.now()}`} 
              onError={e => e.currentTarget.src = '/default-avatar.jpg'}
              className="w-10 h-10 object-cover" 
            />
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