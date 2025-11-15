import axios from "axios";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function useQueryArtists(query: string, selectedType: string) {
  
  const pathname = usePathname()
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null)

  useEffect(() => {
    setShowDropdown(false)
  }, [pathname])

  const fetchSuggestions = useCallback(async () => {

    if (!query.trim()) {
      setSuggestions([])
      return
    }

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
  }, [query, selectedType])

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions()
    }, 500)

    return () => clearTimeout(handler)
  }, [fetchSuggestions])

  return {
    showDropdown,
    setShowDropdown,
    loading,
    suggestions,
    setSuggestions
  }

}