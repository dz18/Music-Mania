import { Dispatch, JSX, SetStateAction, useEffect } from "react"
import ArtistSuggestions from "./ArtistSuggestions"
import UserSuggestions from "./UserSuggestions"
import ReleaseSuggestions from "./ReleaseSuggestions"
import IndeterminateLoadingBar from "../loading/IndeterminateLoadingBar"
import { RefreshCcw } from "lucide-react"
import { ApiPageResponse, SearchTypes } from "@/app/lib/types/api"


export default function SearchDropdown ({
  open,
  type,
  setType,
  data,
  setData,
  loading,
  error,
  fetch
} : {
  open : boolean
  type : string
  setType : Dispatch<SetStateAction<string>>
  data: ApiPageResponse<Suggestion> | null
  setData: Dispatch<SetStateAction<ApiPageResponse<Suggestion> | null>>
  loading: boolean
  error: string | null
  fetch: () => Promise<void>
}) {

  const suggestionComponents: Record<SearchTypes, JSX.Element> = {
    artists: <ArtistSuggestions data={(data?.data as ArtistQuery)}/>,
    releases: <ReleaseSuggestions data={(data?.data as ReleaseQuery)}/>,
    users: <UserSuggestions data={(data?.data as UserQuery)}/>
  }

  useEffect(() => {
    setData(null)
  }, [type])

  if (!open) return

  return (
    <div 
      className="absolute z-10 max-w-[600px] w-full h-fit mt-2 bg-surface border border-gray-700 rounded-xl shadow-md max-h-100 overflow-y-auto "
    >
      
      {/* Select Search Type */}
      <ul className="flex flex-wrap p-2 gap-4 text-sm items-center box-border">
        <li className="text-gray-500">Search:</li>
        {['artists', 'releases', 'users'].map(t => (
          <li
            key={t}
            className={`font-bold p-1 border-b-2 ${t === type ? 'border-teal-500 bg-teal-500/20 text-teal-300' : 
              'border-transparent interactive-button interactive-dark'
            }`}
            onClick={() => setType(t)}
          >
            {t}
          </li>
        ))}
        {data?.data &&
          <>
            <li className="flex grow"/>
            <li className="text-gray-500 text-sm">{data.count} results</li>
          </>
        }
      </ul>

      {loading &&
        <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
      }

      {error ?
        <div className="text-sm px-2 py-4 justify-center flex flex-col">
          <p className="font-semibold text-sm text-center">Error Occurred</p>
          <p className="text-gray-500 text-xs text-center">{error}</p>
          <div className="flex justify-center mt-2">   
            <button 
              className="px-2 py-1 interactive-button interactive-dark flex gap-2 border-gray-500 border rounded text-xs items-center font-bold"
              onClick={fetch}
            >
              <RefreshCcw size={18} className={`${loading && 'animate-spin'}`}/> {!loading && `Retry`}
            </button>
          </div>
        </div>
      :
        data?.data && (
          <>{suggestionComponents[type as SearchTypes]}</>
        )
      }
      
    </div>
  )
}