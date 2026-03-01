import { getSong, songReviewsQuery } from "@/app/lib/api/songs";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";

export default function useFetchSong (
  songId: string,
) {

  const searchParams = useSearchParams()

  const star = searchParams.get('star')
  const page = Number(searchParams.get('page')) || 1

  const songQuery = useQuery({
    queryKey: ['song', songId],
    queryFn: () => getSong(songId),
    enabled: !!songId,
    retry: 3,
    retryDelay: 3000
  })
  
  const reviewsQuery = useQuery({
    queryKey: ["reviews", page, star],
    queryFn: () => songReviewsQuery({
      songId: songId,
      workId: songQuery.data?.song.workId,
      star,
      page
    }),
    enabled: !!songId && songQuery.isSuccess
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
    song: songQuery.data?.song,
    coverArtUrl: songQuery.data?.coverArtUrl,
    songLoad: songQuery.isLoading,
    reviews: reviewsQuery.data,
    reviewsLoad: reviewsQuery.isLoading,
    error: songQuery.error || reviewsQuery.error,
    starStats,
    refetchReviews: reviewsQuery.refetch,
    refetchsong: songQuery.refetch,
  } 


}