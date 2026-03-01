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
    retry: 3,
    retryDelay: 3000
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