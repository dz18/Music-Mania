import { Dispatch, JSX, SetStateAction, useEffect } from "react"
import ArtistSuggestions from "./ArtistSuggestions"
import RecordingSuggestions from "./RecordingSuggestions"
import ReleaseSuggestions from "./ReleaseSuggestions"  


export default function SearchDropdown ({
  open,
  type,
  setType,
  suggestions
} : {
  open : boolean
  type : string
  setType : Dispatch<SetStateAction<string>>
  suggestions: any
}) {

  const searchTypes = ['artists', 'recordings', 'releases'] as const
  type SearchTypes = (typeof searchTypes)[number]

  const suggestionComponents: Record<SearchTypes, JSX.Element> = {
    artists: <ArtistSuggestions suggestions={suggestions}/>,
    recordings: <RecordingSuggestions suggestions={suggestions}/>,
    releases: <ReleaseSuggestions suggestions={suggestions}/>,
  }

  if (!open) return

  return (
    <div 
      className="absolute z-10 max-w-[600px] w-full h-fit mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-md max-h-100 overflow-y-auto"
    >
      
      {/* Select Search Type */}
      <ul className="flex flex-wrap p-2 gap-4 text-sm items-center box-border">
        <li className="text-gray-500">Search:</li>
        {searchTypes.map(t => (
          <li
            key={t}
            className={`cursor-pointer font-bold p-1 border-b-2 ${t === type ? 'border-teal-500 bg-teal-500/20 text-teal-300' : 
              'border-transparent'
            }`}
            onClick={() => setType(t)}
          >
            {t}
          </li>
        ))}
        {suggestions.length !== 0 &&
          <>
            <li className="flex grow"/>
            <li className="text-gray-500 text-sm">{suggestions.length} results</li>
          </>
        }
      </ul>

      {suggestions.length !== 0 && (
        <>
          {suggestionComponents[type as SearchTypes]}
        </>
      )}
    </div>
  )
}