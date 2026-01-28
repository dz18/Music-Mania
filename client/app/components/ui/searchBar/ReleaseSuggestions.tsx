import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect } from "react"
import NoResults from "./NoResults"

export default function ReleaseSuggestions ({
  data,
} : {
  data : ReleaseQuery | null
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
                onClick={() => router.push(`/release/${item.id}`)}
              >
                <div className="border-t-1 border-gray-500 mx-2 py-2 flex justify-between">
                  <div className="">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                    </div>
                    {item?.artistCredit &&
                      <p className="mt-1 text-xs text-gray-400 italic truncate">
                        {item.artistCredit.map((credit, i) => (
                          <span key={i}>{credit.name}{credit.joinphrase}</span>
                        ))}
                      </p>
                    }
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.primaryType}
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