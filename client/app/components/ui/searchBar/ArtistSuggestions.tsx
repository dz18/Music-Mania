import { useEffect } from "react"

export default function ArtistSuggestions ({
  suggestions
} : {
  suggestions : Artist[]
}) {

  useEffect(() => {
    console.log(suggestions)
  }, [suggestions])


  return (
    <>
      {suggestions.map((item : Artist) => (
        <div 
          key={item.id} 
          className="hover:bg-white/20 transition-colors duration-200 cursor-pointer"
        >
          <div className="border-t-1 border-gray-500 mx-2 py-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white truncate">{item.name}</h3>
              {item.type && (
                <span className="text-xs font-medium text-gray-500 tracking-wide select-none">
                  {item.type}
                </span>
              )}
            </div>
            {item.disambiguation && (
              <p className="mt-1 text-sm text-gray-400 italic truncate">{item.disambiguation}</p>
            )}
          </div>
        </div>
      ))}
    </>
  )
}