'use client'

import axios from "axios"
import { Search } from "lucide-react"
import { FormEvent, useEffect, useRef, useState } from "react"
import SearchDropdown from "./SearchDropdown"
import IndeterminateLoadingBar from "../loading/IndeterminateLoadingBar"

export default function SearchBar () {

  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(Boolean)
  const [loading, setLoading] = useState(false)

  const [suggestions, setSuggestions] = useState<ArtistQuery[] | UserQuery[] | ReleaseQuery[] | null>(null)
  const [selectedType, setSelectedType] = useState('artists')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchSuggestions = async () => {
        if (query.trim() && query) {
          try {
            setLoading(true)
            let res
            if (selectedType === 'artists' || selectedType === 'releases') {
              res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/${selectedType}`, {
                params: { q: query }
              })
            } else if (selectedType === 'users') {
              res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/query`, {
                params: { q: query }
              })
            } else {
              throw new Error('Unknown Type')
            }

            const data = res.data
            console.log(data)
            setSuggestions(data || [])
            setShowDropdown(true)
          } catch (error) {
            console.error('Error fetching suggestions:', error)
            setSuggestions([])
          } finally {
            setLoading(false)
          }
        } 
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


  const submit = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(`Searched '${query}'`)
  }

  return (
    <div className="w-full max-w-[600px] hidden sm:block" ref={dropdownRef}>
      <form onSubmit={submit}>
        <div className="relative">

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
          
        </div>
      </form>

      <SearchDropdown 
        open={showDropdown} 
        type={selectedType} 
        setType={setSelectedType}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
        loading={loading}
      />

    </div>
    
  )
}