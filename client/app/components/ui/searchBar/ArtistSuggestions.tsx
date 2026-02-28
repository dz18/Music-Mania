import { useRouter } from "next/navigation"
import NoResults from "./NoResults"
import useDropdown from "@/app/hooks/useSearchDropdown"

export default function ArtistSuggestions ({
  data,
  closeDropdown
} : {
  data : ArtistQuery | null
  closeDropdown: () => void
}) {

  const router = useRouter()

  const handleClick = (itemId: string) => {
    router.push(`/artist/${itemId}`)
    closeDropdown()
  }

  return (
    <>
      {data &&
        data.suggestions.length !== 0 ?
          <>
            {data.suggestions.map((item) => (
              <div 
                key={item.id} 
                className="interactive-button interactive-dark"
                onClick={() => handleClick(item.id)}
              >
                <div className="border-t border-gray-500 mx-2 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                    {item.type && (
                      <span className="text-xs font-medium text-gray-500 tracking-wide select-none">
                        {item.type}
                      </span>
                    )}
                  </div>
                  {item.disambiguation && (
                    <p className="mt-1 text-xs text-gray-400 italic truncate">{item.disambiguation}</p>
                  )}
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