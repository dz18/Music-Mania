import axios, { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function useSearchQuery(query: string, selectedType: string) {
  
  const pathname = usePathname()
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setShowDropdown(false)
  }, [pathname])

  const fetchSuggestions = useCallback(async () => {

    if (!query.trim()) {
      setSuggestions(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

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
      const err = error as AxiosError<{error: string}>
      console.error("Review fetch failed", err.response?.data.error)
      setError(err.response?.data.error ?? err.message)
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
    setSuggestions,
    error,
    fetchSuggestions
  }

}