'use client'

import { DOMAttributes, FormEvent, FormEventHandler, JSX, useEffect, useState } from "react"
import useSearchQuery from "../hooks/musicbrainz/useSearchQuery"
import ArtistSearch from "./ArtistSearch"
import ReleaseSearch from "./ReleaseSearch"
import UserSearch from "./UserSearch"
import { SearchTypes } from "../lib/types/api"
import Pagination from "../components/ui/Pagination"
import IndeterminateLoadingBar from "../components/ui/loading/IndeterminateLoadingBar"
import { FileX2, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SearchPage ({
  params
} : {
  params: {type: string, q: string}
}) {

  const router = useRouter()
  const [query, setQuery] = useState(params.q ?? '')
  const [type, setType] = useState(params.type ?? 'artists')
  const [newQuery, setNewQuery] = useState('')

  const {
    data, error, loading,
    fetchSuggestions, setData
  } = useSearchQuery(query, type)

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (type) params.set("type", type)

    router.replace(`/search?${params.toString()}`)
  }, [query, type])

  useEffect(() => {
    setData(null)
  }, [type])

  const tabs = [
    {tab: 'Artists', id: 'artists'},
    {tab: 'Releases', id: 'releases'},
    {tab: 'Users', id: 'users'},
  ]

  const suggestionComponents: Record<SearchTypes, JSX.Element> = {
    artists: <ArtistSearch data={(data?.data as ArtistQuery)}/>,
    releases: <ReleaseSearch data={(data?.data as ReleaseQuery)}/>,
    users: <UserSearch data={(data?.data as UserQuery)}/>
  }

  const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setQuery(newQuery)
  }

  return (
    <div>

      <section className="flex mb-2 gap-2">
        <form action="submit" onSubmit={handleSubmit} className="flex mb-2 gap-2 w-full">
          <button 
            className="p-2 border rounded cursor-pointer"
          >
            <Search size={18}/>
          </button>
          <input 
            type="text" 
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            className="p-1 border w-full rounded"
          />
        </form>
      </section>

      {/* Select Type */}
      <section>
        <ul className="list-none flex flex-wrap gap-1 box-border">
          {tabs.map(t => (
            <li key={t.id}
              className={`
                ${type === t.id ? "border-teal-300 bg-teal-500/20 text-teal-300 border-b-4" : ""}
                font-mono font-bold p-2 box-border cursor-pointer
              `}
              onClick={() => setType(t.id)}
            >
              {t.tab}
            </li>
          ))}
        </ul>
      </section>

      {/* Suggestions */}
      <section>
        <div className="flex justify-between m-1">
          <div>
            <span className="text-lg font-mono text-gray-500">Search: </span>
            <span className="text-lg font-mono font-bold truncate overflow-hidden whitespace-nowrap">{query.trim().replace(/'+'/g, ' ')}</span>
          </div>
          <div>
            <span className="text-lg font-mono text-gray-500">Total: </span>
            <span className="text-lg font-mono font-bold text-teal-500">{data?.count}</span>
          </div>
        </div>

        {type &&
          loading ? (
            <div>
              <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
            </div>
          ) : (
            <ul>
              {suggestionComponents[type as SearchTypes]}
            </ul>
          )

        }
        {data && data?.data.suggestions.length !== 0 ?
          <Pagination data={data} fetchData={fetchSuggestions}/>
        :
          <div className="flex items-center justify-center font-mono mt-[5rem] gap-2 text-gray-500">
            <FileX2/> No data found
          </div>
        }
      </section>

    </div>
  )
}