'use client'

import { Search } from "lucide-react"
import { FormEvent, useEffect, useRef, useState } from "react"
import SearchDropdown from "./SearchDropdown"
import useSearchQuery from "@/app/hooks/musicbrainz/useSearchQuery"
import { useRouter } from "next/navigation"

export default function SearchBar () {

  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('artists')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const {
    showDropdown,
    setShowDropdown,
    loading,
    setData,
    data,
    error,
    fetchSuggestions
  } = useSearchQuery(query, selectedType)

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
    router.push(`/search?tab=${selectedType}&q=${query.trim().replace(/ /g, '+')}`)
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
        data={data}
        setData={setData}
        loading={loading}
        error={error}
        fetch={() => fetchSuggestions(1)}
      />
      


    </div>
    
  )
}