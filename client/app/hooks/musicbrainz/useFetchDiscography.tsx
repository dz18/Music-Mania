'use client'

import { getDiscography, getArtist } from "@/app/lib/api/discography"
import { DiscographyType } from "@/app/lib/types/discography"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const VALID_TYPES: DiscographyType[] = ['album', 'ep', 'single']

export default function useFetchDiscography(artistId: string) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const page = Number(searchParams.get('page')) || 1

  const rawActive = searchParams.get('active')
  const active: DiscographyType = VALID_TYPES.includes(rawActive as DiscographyType)
    ? (rawActive as DiscographyType)
    : 'album'

  useEffect(() => {
    if (!VALID_TYPES.includes(rawActive as DiscographyType)) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('active', 'album')
      params.set('page', '1')
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [rawActive, pathname, router, searchParams])

  const artistQuery = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => getArtist(artistId),
    enabled: !!artistId,
    retry: 3,
    retryDelay: 3000
  })

  const discographyQuery = useQuery({
    queryKey: ['discography', artistId, active, page],
    queryFn: () => getDiscography(artistId, active, page),
    enabled: !!artistId,
    staleTime: 1000 * 60 * 5,
    placeholderData: undefined,
  })

  return {
    artist: artistQuery.data,
    loadingArtist: artistQuery.isLoading,
    errorArtist: artistQuery.error,
    discography: discographyQuery.data,
    loadingDiscography: discographyQuery.isLoading,
    errorDiscography: discographyQuery.error,
    error: artistQuery.isError || discographyQuery.isError,
    refetchArtist: artistQuery.refetch,
    refetchDiscography: discographyQuery.refetch,
    active,
    page,
  }
}