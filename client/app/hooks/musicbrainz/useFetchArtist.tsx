import ArtistPage from "@/app/components/pages/artist/ArtistPage";
import { artistReviewsQuery, getArtist } from "@/app/lib/api/artists";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";

export default function useFetchArtist (
  artistId: string,
) {
  
  const searchParams = useSearchParams()
  
  const star = searchParams.get('star')
  const page = Number(searchParams.get('page')) || 1

  const artistQuery = useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => getArtist({id: artistId}),
    enabled: !!artistId,
    retry: 3,
    retryDelay: 3000
  })

  const reviewsQuery = useQuery({
    queryKey: ["reviews", page, star],
    queryFn: () => artistReviewsQuery({
      id: artistId,
      star,
      page
    }),
    enabled: !!artistId
  })

  const lastStarStats = useRef<StarCount[]>([])
  const starStats = useMemo(() => {
    let next: StarCount[] | undefined = undefined

    if (reviewsQuery.data?.data.starStats) {
      next = reviewsQuery.data?.data.starStats
    }

    if (next) lastStarStats.current = next

    return lastStarStats.current
  }, [reviewsQuery.data])

  return {
    artist: artistQuery.data,
    artistLoad: artistQuery.isLoading,
    reviews: reviewsQuery.data,
    reviewsLoad: reviewsQuery.isLoading,
    error: artistQuery.error || reviewsQuery.error,
    starStats,
    refetchReviews: reviewsQuery.refetch,
    refetchArtists: artistQuery.refetch,
  } 

}