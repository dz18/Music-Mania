'use client'

import { Search } from "lucide-react"
import { FormEvent, useEffect, useRef, useState } from "react"
import SearchDropdown from "./SearchDropdown"
import useSearchQuery from "@/app/hooks/musicbrainz/useSearchQuery"
import { useRouter } from "next/navigation"
import useDebounce from "@/app/hooks/debounce"
import useDropdown from "@/app/hooks/useSearchDropdown"

export default function SearchBar () {

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [selectedType, setSelectedType] = useState('artists')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const {
    searchResults,
    isLoading,
    error,
    refetch
  } = useSearchQuery(debouncedQuery, selectedType)

  const { 
    open,
    openDropdown,
    closeDropdown
  } = useDropdown()

  useEffect(() => {
    function clickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }

    document.addEventListener('mousedown', clickOutside)
    return () => {
      document.removeEventListener('mousedown', clickOutside)
    }
  }, [closeDropdown])

  const submit = (e : FormEvent<HTMLFormElement>) => {
    router.push(`/search?tab=${selectedType}&q=${query.trim().replace(/ /g, '+')}`)
    closeDropdown()
  }

  return (
    <div className="w-full max-w-150 hidden sm:block" ref={dropdownRef}>
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
            className="block w-full p-1 ps-8 text-sm border rounded-xl input-glow"
            placeholder="Search"
            type="search" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={openDropdown}
          />
          
        </div>
      </form>

      <SearchDropdown 
        open={open}
        closeDropdown={closeDropdown}
        type={selectedType} 
        setType={setSelectedType}
        data={searchResults}
        loading={isLoading}
        error={error?.message}
        fetch={async () => { await refetch() }}
      />
      


    </div>
    
  )
}