import { ReleaseGroup } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useFetchDiscography(artistId: string) {
  
  const [active, setActive] = useState<'album' | 'ep' | 'single'>('album')
  const [discography, setDiscography] = useState<ReleaseGroup[]>([])
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [artistLoad, setArtistLoad] = useState(false)
  const [tableLoad, setTableLoad] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [artistId])

  const fetchData = async () => {
    if (!artistId) return

    try {
      setArtistLoad(true)
      setTableLoad(true)
      setError(null)

      const [discog, artist] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/discography`, {
          params: { artistId, type: 'album' }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
          params: { id: artistId }
        }),
      ])

      const discography = discog.data

      setDiscography(discography.data)
      setCount(discography.count)
      setArtist(artist.data)
    } catch (error : any) {
      const err = error as AxiosError<{error: string}>
      console.error("Review fetch failed", err.response?.data.error)
      setError(err.response?.data.error ?? err.message)
    } finally {
      setArtistLoad(false)
      setTableLoad(false)
    }
  }

  const fetchDiscog = useCallback(async (artistId: string, type: 'album' | 'single' | 'ep', offset: number = 0) => {
    try {
      setError(null)
      setTableLoad(true)
      setActive(type)
      setOffset(offset)

      const discog = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/discography`, {
        params: { artistId, type: type, offset }
      })

      const discography = discog.data

      setDiscography(discography.data)
      setCount(discography.count)

    } catch (error : any) {
      const err = error as AxiosError<{error: string}>
      console.error("Review fetch failed", err.response?.data.error)
      setError(err.response?.data.error ?? err.message)
    } finally {
      setTableLoad(false)
    }
  }, [])

  return { 
    discography,
    artist,
    active,
    count,
    offset,
    artistLoad,
    tableLoad,
    fetchDiscog,
    error
  }

}