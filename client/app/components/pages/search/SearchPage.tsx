'use client'

import { DOMAttributes, FormEvent, FormEventHandler, JSX, useEffect, useState } from "react"
import useSearchQuery from "../../../hooks/musicbrainz/useSearchQuery"
import ArtistSearch from "./ArtistSearch"
import ReleaseSearch from "./ReleaseSearch"
import UserSearch from "./UserSearch"
import { SearchTypes } from "../../../lib/types/api"
import Pagination from "../../ui/Pagination"
import IndeterminateLoadingBar from "../../ui/loading/IndeterminateLoadingBar"
import { FileX2, RefreshCcw, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SearchPage ({
  params
} : {
  params: {tab: string, q: string}
}) {

  const router = useRouter()
  const [query, setQuery] = useState(params.q ?? '')
  const [tab, setTab] = useState(params.tab ?? 'artists')

  const {
    data, error, loading, artistType, releaseType,
    fetchSuggestions, setData, setArtistType, setReleaseType
  } = useSearchQuery(query, tab)

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (tab) params.set("tab", tab)

    router.replace(`/search?${params.toString()}`)
  }, [query, tab])

  useEffect(() => {
    setData(null)
  }, [tab])

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
    fetchSuggestions()
  }

  return (
    <div>
      <section className="flex mb-2 gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col w-full text-sm">
          <div className="flex mb-2 gap-2 w-full">
            <button type="submit" className="p-2 border rounded interactive-button interactive-dark" title={`Search ${query}`}>
              <Search size={18}/>
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-2 py-1 border w-full rounded hover-white-glow focus-cyan-glow focus:outline-none"
            />
          </div>

          {tab === 'artists' &&
            <div className="py-2">
              <label htmlFor="artist-type" className="font-mono text-sm font-bold mr-2">Type:</label>
              <select
                id="artist-type"
                className="p-1 border rounded bg-[#171717] text-white hover-white-glow focus-cyan-glow"
                value={artistType}
                onChange={(e) => setArtistType(e.target.value)}
              >
                <option value="">All</option>
                <option value="person">Person</option>
                <option value="group">Group</option>
                <option value="character">Character</option>
              </select>
            </div>
          }

          {tab === 'releases' &&
            <div className="py-2">
              <label htmlFor="release-type" className="font-mono text-sm font-bold mr-2">Type:</label>
              <select
                id="release-type"
                className="p-1 border rounded bg-[#171717] text-white hover-white-glow focus-cyan-glow"
                value={releaseType}
                onChange={(e) => setReleaseType(e.target.value)}
              >
                <option value="">All</option>
                <option value="album">Album</option>
                <option value="ep">EP</option>
              </select>
            </div>
          }
        </form>
      </section>

      {/* Select Type */}
      <section className="flex items-center justify-between items-end">
        <ul className="list-none flex flex-wrap gap-1 box-border">
          {tabs.map(t => (
            <li key={t.id}
              className={`
                ${tab === t.id ? "border-teal-300 bg-teal-500/20 text-teal-300 border-b-4" : "interactive-button interactive-dark"}
                font-mono font-bold p-2 box-border
              `}
              onClick={() => setTab(t.id)}
            >
              {t.tab}
            </li>
          ))}
        </ul>

        <div>
          <span className="font-mono text-sm text-gray-500">{data?.count ? data.count : '0'} total results</span>
        </div>
      </section>

      {/* Suggestions */}
      <section className="border-gray-500 border rounded-xl mt-2">
        <div className="flex justify-between px-2 py-1 bg-surface-elevated rounded-xl rounded-b-none tracking-wide">
          <div>
            <span className="font-semibold font-mono text-gray-500 tracking-wide uppercase">Search: </span>
            <span className="font-mono font-bold truncate overflow-hidden whitespace-nowrap">{query.trim().replace(/'+'/g, ' ')}</span>
          </div>
        </div>

        {tab &&
          loading ? (
            <div>
              <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
            </div>
          ) : (
            error ? 
              <div className="flex items-center flex-col p-2 gap-2">
                <p className="font-mono">{error}</p>
                <div>   
                  <button
                    className="px-2 py-1 bg-teal-500 text-black font-mono cursor-pointer flex gap-2 items-center rounded"
                    onClick={() => fetchSuggestions(1)}
                  >
                    Refresh <RefreshCcw size={18}/>
                  </button>
                </div>
              </div>
            :
              <ul className="border-b border-gray-500">
                {suggestionComponents[tab as SearchTypes]}
              </ul>
          )
        }
        {data && data?.data.suggestions.length !== 0 ?
          <Pagination data={data} fetchData={fetchSuggestions}/>
        :
          !error  && !loading &&
            <div className="flex items-center justify-center font-mono my-[5rem] gap-2 text-gray-500">
              <FileX2/> No data found
            </div>
        }
      </section>

    </div>
  )
}