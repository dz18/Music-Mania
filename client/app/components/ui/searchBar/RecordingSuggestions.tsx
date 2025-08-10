import { useEffect } from "react"

export default function RecordingSuggestions ({
  suggestions
} : {
  suggestions : []
}) {

  return (
    <>
      {suggestions.map((item : Recording) => (
        <div
          key={item.id}
          className="hover:bg-white/20 transition-colors duration-200 cursor-pointer"
        >
          <div className="border-t-1 border-gray-500 mx-2 py-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white truncate">{item.title}</h3>
            </div>
            {item?.artistCredit &&
              <p className="mt-1 text-sm text-gray-500 italic truncate">
                {item.artistCredit.map((credit, i) => (
                  <span key={i}>{credit.name}{credit.joinphrase}</span>
                ))}
              </p>
            }
          </div>
        </div>
      ))}
    </>
  )
}