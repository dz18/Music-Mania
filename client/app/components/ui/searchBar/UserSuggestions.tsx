import { useRouter } from "next/navigation"
import NoResults from "./NoResults"
import { Dispatch, SetStateAction } from "react"

export default function UserSuggestions ({
  data,
} : {
  data : UserQuery | null
}) {

  const router = useRouter()

  return (
    <>
      {data &&
        data.suggestions.length !== 0 ?
          <>
            {data.suggestions.map((item) => (
              <div 
                key={item.id} 
                className="hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                onClick={() => router.push(`/profile/${item.id}`)}
              >
                <div className="border-t-1 border-gray-500 mx-2 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-white truncate">{item.username}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 italic truncate">
                    Joined {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </>
        :
          <NoResults/>
      }
    </>
  )
}