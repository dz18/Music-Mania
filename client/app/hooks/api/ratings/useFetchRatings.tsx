'use client'

import { ApiPageResponse, Release, ReviewRatingsResponse, ReviewResponse } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import { Song } from "@/app/lib/types/song";
import axios from "axios";
import { usePathname } from "next/navigation";
import { release } from "os";
import { useCallback, useEffect, useState } from "react";

export default function useFetchReviewRatings (
  id: string,
  star: number
) {

  const pathname = usePathname()

  const [data, setData] = useState<ApiPageResponse<ReviewRatingsResponse> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [item, setItem] = useState<Artist | Release | Song |null>(null)
  const [itemLoad, setItemLoad] = useState(false)
  const [coverArt, setCoverArt] = useState<string | null>(null)

  const fetchData = useCallback(async (page: number) => {
    if (!star) {
      setError('Missing ID or specific star rating')
      return
    }

    try {
      setLoading(true)

      const segments = pathname.split("/").filter(Boolean)

      if (!item) setItemLoad(true)

      const res = await axios.get<ApiPageResponse<ReviewResponse>>(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${segments[0]}/${segments[1]}/itemRatings`, {
        params: { star: star, page: page}
      })

      setData(res.data)
      
      console.log(segments[0])
      if (segments[0] === 'artist' && !item) {
        const artistRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
          params: { id: id }
        })
        console.log(artistRes.data)
        setItem(artistRes.data)
      } else if (segments[0] === 'release' && !item) {
        const releaseRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getRelease`, {
          params: { releaseId: id }
        })
        console.log(releaseRes.data)
        setCoverArt(releaseRes.data.coverArtUrl)
        setItem(releaseRes.data.album)
      } else if (segments[0] === 'song' && !item) {
        const songRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getSong`, {
          params: { songId: id }
        })
        console.log(songRes.data)
        setCoverArt(songRes.data.coverArtUrl)
        setItem(songRes.data.song)
      }

    } catch (error : any) {
			setError(error.response?.data?.error || error.message)
    } finally {
      setLoading(false) 
      setItemLoad(false)
    }
  }, [star])

  useEffect(() => {
    fetchData(1)
  }, [fetchData])

  return {
    data,
    loading,
    error,
    item,
    itemLoad,
    coverArt,
    fetchData
  }

}