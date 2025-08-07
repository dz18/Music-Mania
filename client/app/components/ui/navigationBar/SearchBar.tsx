'use client'

import axios from "axios"
import { Search } from "lucide-react"
import { FormEvent, useEffect, useRef, useState } from "react"

type Artist = {
  id: string,
  name: string
}

type Record = {
  id: string,
  title: string
}

type Release = {
  id: string,
  title: string,
  date: string,
  'artist-credit' : {
    joinphrase?: string
    name: 'string',
    artist: Artist
  }[],
  'release-group' : {
    'primary-type' : 'string'
  }
}

export default function SearchBar () {

  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(Boolean)

  const [suggestions, setSuggestions] = useState<Artist[] | Record[] | Release[]>([])
  const [selectedType, setSelectedType] = useState('artists')
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  
  const searchTypes = [
    'artists',
    'recordings',
    'releases',
  ]

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchSuggestions = async () => {
        setLoading(true)
        if (query.trim() && query) {
          try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/${selectedType}`, {
              params: {q : query}
            })

            const data = res.data
            console.log(data)
            setSuggestions(data || [])
            setShowDropdown(true)
          } catch (error) {
            console.error('Error fetching suggestions:', error)
            setSuggestions([])
          }
        } 
        setLoading(false)
      }
      
      fetchSuggestions()
    }, 500)

    return () => clearTimeout(handler);
  }, [query, selectedType])

  useEffect(() => {
    function clickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', clickOutside)
    return () => {
      document.removeEventListener('mousedown', clickOutside)
    }
  }, [])

  useEffect(() => {
    setSuggestions([])
  }, [selectedType])

  const submit = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(`Searched '${query}'`)
  }

  const clickSuggestion = (id: string) => {
    alert(`id: ${id}`)  
  }

  const renderItems = (item : Artist | Record | Release) => {
    
    if(suggestions.length === 0) return null

    if (selectedType === 'artists') {
      const label = (item as Artist).name

      return (
        <li 
          key={item.id} 
          className="hover:bg-black/20 active:bg-black/40 p-2 cursor-pointer"
          onClick={() => clickSuggestion(item.id)}
        >
          {label}
        </li>
      )
    } else if (selectedType === 'recordings') {
      const label = (item as Record).title

      return (
        <li 
          key={item.id} 
          className="hover:bg-black/20 active:bg-black/40 p-2 cursor-pointer"
          onClick={() => clickSuggestion(item.id)}
        >
          {label}
        </li>
      )
    } else if (selectedType === 'releases') {

      const label = (item as Release).title

      const artistCredit = (item as Release)?.["artist-credit"] || []
      const mainArtist = artistCredit.filter(item => !item.joinphrase)
      const artistName = mainArtist[0]?.name || null

      const releaseGroup = (item as Release)?.["release-group"]
      const primaryType = releaseGroup?.["primary-type"]

      return (
        <li 
          key={item.id} 
          className="hover:bg-black/20 active:bg-black/40 p-2 cursor-pointer"
          onClick={() => clickSuggestion(item.id)}
        >
          <p className="text-base">{label}</p>
          <p className="text-sm text-gray-500">{artistName}, {primaryType}</p>
        </li>
      )
    }

    return null
  }

  return (
    <form className="w-full max-w-[600px] hidden sm:block" onSubmit={submit}>
      <div className="relative" ref={dropdownRef}>

        <button 
          className="absolute left-2 bottom-0 top-0 items-center cursor-pointer"
          type="submit"
        >
          <Search 
            size={18}
          />
        </button>
        <input 
          className="block w-full p-1 ps-8 text-sm border-1 rounded-xl hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] focus:shadow-[0_0_15px_rgba(0,255,255,0.8)] focus:outline-none transition-shadow"
          placeholder="Search"
          type="search" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />

        
          {showDropdown &&
            <div 
              className="absolute z-10 w-full h-fit mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-md max-h-100 overflow-y-auto"
            >
              
              {/* Select Search Type */}

              <ul className="flex flex-wrap p-2 gap-4 text-sm items-center box-border">
                <li className="text-gray-500">Search:</li>
                {searchTypes.map(type => (
                  <li
                    key={type}
                    className={`cursor-pointer font-bold p-1 border-b-2 ${type === selectedType ? 'border-teal-500 bg-teal-500/20 text-teal-300' : 
                      'border-transparent'
                    }`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </li>
                ))}
              </ul>

              {/* Suggestions */}
              {!loading ? (
                suggestions.length !== 0 ? (
                  <>
                    <div className={`border-t-1 border-gray-500 mx-2 mb-1 ${suggestions.length === 0 && 'hidden'}`}/>
                    {suggestions.map(renderItems)}
                  </>
                ) : (
                  query && (
                    <p>No results</p>
                  ) 
                )
              ) : (
                <div className="p-2">Loading...</div>
              )}
            </div>
          }

      </div>
    </form>
  )
}