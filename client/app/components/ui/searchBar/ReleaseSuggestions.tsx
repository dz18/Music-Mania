import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect } from "react"
import NoResults from "./NoResults"

export default function ReleaseSuggestions ({
  suggestions,
} : {
  suggestions : ReleaseQuery[] | null
}) {

  const router = useRouter()

  useEffect(() => {
    console.log('suggestions:', suggestions)
  }, [suggestions])


  return (
    <>
      {suggestions &&
        suggestions.length !== 0 ?
          suggestions.map((item : ReleaseQuery) => (
            <div 
              key={item.id} 
              className="hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              onClick={() => router.push(`/release/${item.id}`)}
            >
              <div className="border-t-1 border-gray-500 mx-2 py-2 flex justify-between">
                <div className="">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-white truncate">{item.title}</h3>
                    {item.type && (
                      <span className="text-xs font-medium text-gray-500 tracking-wide select-none">
                        {item.type}
                      </span>
                    )}
                  </div>
                  {item?.["artist-credit"] &&
                    <p className="mt-1 text-sm text-gray-500 italic truncate">
                      {item["artist-credit"].map((credit, i) => (
                        <span key={i}>{credit.name}{credit.joinphrase}</span>
                      ))}
                    </p>
                  }
                </div>
                <p className="text-sm text-gray-500">
                  {item['primary-type']}
                </p>
              </div>
            </div>
          ))
        :
          <NoResults/>
      }
    </>
  )
}