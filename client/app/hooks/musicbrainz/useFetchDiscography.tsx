import { Artist } from "@/app/lib/types/artist";
import { DiscographyResponse, DiscographyType } from "@/app/lib/types/discography";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useFetchDiscography(
  artistId: string,
) {
  

  const [artist, setArtist] = useState<Artist | null>(null)
  const [data, setData] = useState<DiscographyResponse | null>(null)
  const [artistLoad, setArtistLoad] = useState(false)
  const [tableLoad, setTableLoad] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState<DiscographyType>('album')

  const fetchData = useCallback(async(page: number = 1) => {
    if (!artistId || !page) {
      setError('Missing required parameters')
      return
    }

    try {
      setTableLoad(true)
      if (!artist) { setArtistLoad(true) }

      const discog = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/discography`, {
        params: { artistId, type: active, page: page }
      })
      
      setData(discog.data)
      setError(null)

      if (!artist) {
        const artistRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/getArtist`, {
          params: { id: artistId }
        })
        setArtist(artistRes.data)
      }

    } catch (error : any) {
      const err = error as AxiosError<{error: string}>
      console.error("Review fetch failed", err.response?.data.error)
      setError(err.response?.data.error ?? err.message)
    } finally {
      setArtistLoad(false)
      setTableLoad(false)
    }   
  }, [artistId, active])

  useEffect(() => {
    fetchData(1)
  }, [fetchData])

  return { 
    artist,
    artistLoad,
    tableLoad,
    fetchData,
    error,
    data,
    active,
    setActive
  }

}