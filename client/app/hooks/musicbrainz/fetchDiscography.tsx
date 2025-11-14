import { ReleaseGroup } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function fetchDiscography(artistId: string) {
  
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
      const [discog, artist] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/discography`, {
          params: { artistId, type: 'album' }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
          params: { id: artistId }
        }),
      ])

      const discography = discog.data

      console.log(discography.data)
      setDiscography(discography.data)
      setCount(discography.count)
      setArtist(artist.data)
    } catch (error : any) {
      console.error(error)
      setError(error?.message ?? 'error')
    } finally {
      setArtistLoad(false)
      setTableLoad(false)
    }
  }

  const fetchDiscog = useCallback(async (artistId: string, type: 'album' | 'single' | 'ep', offset: number = 0) => {
    try {
      console.log(offset)
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
      console.error(error)
      setError(error?.response.data.error ?? 'error')
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