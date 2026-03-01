import { getRelease, releaseReviewsQuery } from "@/app/lib/api/releases";
import { ReviewKind } from "@/app/lib/types/reviews";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { release } from "os";
import { useMemo, useRef } from "react";

export default function useFetchRelease (
  releaseId: string,
) {

  const searchParams = useSearchParams()

  const star = searchParams.get('star')
  const page = Number(searchParams.get('page')) || 1

  const releaseQuery = useQuery({
    queryKey: ['release', releaseId],
    queryFn: () => getRelease(releaseId),
    enabled: !!releaseId,
    retry: 3,
    retryDelay: 3000
  })

  const reviewsQuery = useQuery({
    queryKey: ["reviews", page, star],
    queryFn: () => releaseReviewsQuery({
      id: releaseId,
      star,
      page
    }),
    enabled: !!releaseId
  })

  const lastStarStats = useRef<StarCount[]>([])
  const starStats = useMemo(() => {
    let next: StarCount[] | undefined = undefined

    if (reviewsQuery.data) {
      next = reviewsQuery.data?.data.starStats
    }

    if (next) lastStarStats.current = next

    return lastStarStats.current
  }, [reviewsQuery.data])

  return {
    release: releaseQuery.data,
    releaseLoad: releaseQuery.isLoading,
    reviews: reviewsQuery.data,
    reviewsLoad: reviewsQuery.isLoading,
    error: releaseQuery.error || reviewsQuery.error,
    starStats,
    refetchReviews: reviewsQuery.refetch,
    refetchRelease: releaseQuery.refetch,
  } 

}