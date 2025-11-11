'use client'

import DiscographyTable from "@/app/components/artist/DiscographyTable";
import Pagination from "@/app/components/artist/Pagination";
import Container from "@/app/components/ui/Container";
import Footer from "@/app/components/ui/Footer";
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar";
import Nav from "@/app/components/ui/NavigationBar";
import UnderConstruction from "@/app/lib/fallback/UnderConstruction";
import { ReleaseGroup } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import axios from "axios";
import { ChevronsLeft, ChevronsRight, FileX2, Image, ImageOff, Loader, Type } from "lucide-react";
import { Preahvihear } from "next/font/google";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";

export default function Discography ({
  params
} : {
  params: Promise<{artistId: string}>
}) {

  const { artistId } = use(params)

  const [active, setActive] = useState<'album' | 'ep' | 'single'>('album')
  const [discography, setDiscography] = useState<ReleaseGroup[]>([])
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [artistLoad, setArtistLoad] = useState(false)
  const [tableLoad, setTableLoad] = useState(false)

  useEffect(() => {
    
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
      } catch (error) {
        console.error(error)
      } finally {
        setArtistLoad(false)
        setTableLoad(false)
      }
    }

    fetchData()

  }, [])

  const fetchDiscog = useCallback(async (artistId: string, type: 'album' | 'single' | 'ep', offset: number = 0) => {
    try {
      console.log(offset)
      setTableLoad(true)
      setActive(type)
      setOffset(offset)

      const discog = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/musicbrainz/discography`, {
        params: { artistId, type: type, offset }
      })

      const discography = discog.data

      setDiscography(discography.data)
      setCount(discography.count)

    } catch (error) {
      console.error(error)
    } finally {
      setTableLoad(false)
    }
  }, [])

  return (
    <div>
      <Nav/>
      <Container>
        <div className="min-w-full min-h-screen mt-20 mb-10 flex flex-col">

          <div className="mb-2">
            <p className="font-mono font-bold text-2xl">Discography</p>
          </div>
          
          <div className="mb-2">
            {!artistLoad?  
              <>
                <p className="font-mono text-lg font-bold">{artist?.name}</p>
                <p className="font-mono text-sm">{artist?.disambiguation}</p>
              </>
            :
              <p className="font-mono text-lg font-bold text-gray-500 flex items-center gap-1"><Loader size={18} className="animate-spin"/>Loading...</p>
            }
          </div>

          <div className="flex justify-between items-end mb-2">
            <ul className="text-lg font-bold flex flex-wrap list-none gap-3">
              <li 
                onClick={() => fetchDiscog(artistId, 'album')}
                className={`${active === 'album' ? 'border-teal-300 bg-teal-500/20 text-teal-300 border-b-4' : ''} px-2 py-1 cursor-pointer`}
              >Albums</li>
              <li 
                onClick={() => fetchDiscog(artistId, 'ep')}
                className={`${active === 'ep' ? 'border-teal-300 bg-teal-500/20 text-teal-300 border-b-4' : ''} px-2 py-1 cursor-pointer`}
              >EPs</li>
              <li 
                onClick={() => fetchDiscog(artistId, 'single')}
                className={`${active === 'single' ? 'border-teal-300 bg-teal-500/20 text-teal-300 border-b-4' : ''} px-2 py-1 cursor-pointer`}
              >Singles</li>
            </ul>

            <p className="font-mono text-sm text-gray-500">
              {count} total results
            </p>
          </div>
          
          
          {!tableLoad ?
            discography.length !== 0 ?
              <DiscographyTable discography={discography} active={active}/>
            :
              <div className="flex items-center justify-center font-mono mt-[5rem] gap-2 text-gray-500">
                <FileX2/> No data found
              </div>
          :
            <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
          }

          {discography.length !== 0 &&
            <div className="my-3">
              <Pagination
                artistId={artistId}
                active={active}
                offset={offset}
                count={count}
                fetchDiscog={fetchDiscog}
                loading={tableLoad}
              />
            </div>
          }

          
          
        </div>

      </Container>
      <Footer/>
    </div>
  )
}