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
                className=" interactive-button interactive-dark"
                onClick={() => router.push(`/profile/${item.id}`)}
              >
                <div className="border-t-1 border-gray-500 mx-2 py-2">
                  <div className="flex gap-2">
                    <img 
                      className="w-10"
                      src={`${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${item.id}?v=${Date.now()}`} 
                      alt="Avatar" 
                      onError={e => {e.currentTarget.src = '/default-avatar.jpg'}}
                    />

                    <div className="items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">{item.username}</h3>
                      <div>
                        <p className="mt-1 text-xs text-gray-500 italic truncate">
                          Joined {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
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