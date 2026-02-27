import { getSearchResults } from "@/app/lib/api/search";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function useSearchQuery(
  query: string, 
  selectedTab: string,
  filters?: {
    artistType: string,
    releaseType: string
  }
) {


  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const type = searchParams.get('type')

  const searchQuery = useQuery({
    queryKey: ['search', query, selectedTab, filters],
    queryFn: () => getSearchResults(
      { 
        q: query, page, 
        type: selectedTab === 'artists' 
          ? filters?.artistType 
          : filters?.releaseType 
      },
      selectedTab
    ),
    enabled: !!query && !!selectedTab,
  })

  return {
    searchResults: searchQuery.data,
    isSuccess: searchQuery.isSuccess,
    isLoading: searchQuery.isLoading,
    isError: searchQuery.isError,
    error: searchQuery.error,
    refetch: searchQuery.refetch,
  }

}

// export default function useSearchQuery(query: string, selectedTab: string) {
  
//   const pathname = usePathname()

//   const [showDropdown, setShowDropdown] = useState<boolean>(false)
//   const [loading, setLoading] = useState(false)
//   const [data, setData] = useState<ApiPageResponse<Suggestion> | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [page, setPage] = useState(1)
//   const [artistType, setArtistType] = useState('')
//   const [releaseType, setReleaseType] = useState('')

//   useEffect(() => {
//     setShowDropdown(false)
//   }, [pathname])

//   const fetchSuggestions = useCallback(async (page: number = 1) => {

//     if (!query.trim()) {
//       setData(null)
//       return
//     }

//     try {
//       setLoading(true)
//       setError(null)

//       let res
//       if (selectedTab === 'artists' || selectedTab === 'releases') {
//         res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/${selectedTab}`, {
//           params: { q: query, page: page, type: selectedTab === 'artists' ? artistType : releaseType }
//         })
//       } else if (selectedTab === 'users') {
//         res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/query`, {
//           params: { q: query, page: page }
//         })
//       } else {
//         throw new Error('Unknown Type')
//       }

//       const data = res.data
//       setData(data)
//       setShowDropdown(true)
//     } catch (error) {
//       const err = error as AxiosError<{error: string}>
//       console.error("Review fetch failed", err.response?.data.error)
//       setError(err.response?.data.error ?? err.message)
//       setData(null)
//     } finally {
//       setLoading(false)
//     }

//   }, [query, selectedTab, artistType, releaseType])

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setPage(1)
//       fetchSuggestions(1)
//     }, 500)

//     return () => clearTimeout(handler)
//   }, [fetchSuggestions])

//   useEffect(() => {
//     fetchSuggestions(page)
//   }, [page])

//   return {
//     showDropdown,
//     setShowDropdown,
//     loading,
//     data,
//     setData,
//     error,
//     fetchSuggestions,
//     setPage,
//     artistType,
//     releaseType,
//     setArtistType,
//     setReleaseType
//   }

// }