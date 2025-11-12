'use client'

import DiscographyTable from "@/app/components/artist/DiscographyTable";
import Pagination from "@/app/components/artist/Pagination";
import Container from "@/app/components/ui/Container";
import Footer from "@/app/components/ui/Footer";
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar";
import LoadingBox from "@/app/components/ui/loading/loadingBox";
import Nav from "@/app/components/ui/NavigationBar";
import fetchDiscography from "@/app/hooks/musicbrainz/fetchDiscography";
import UnderConstruction from "@/app/lib/fallback/UnderConstruction";
import { ReleaseGroup } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import axios from "axios";
import { ChevronsLeft, ChevronsRight, FileX2, Image, ImageOff, Loader, RefreshCcw, Type } from "lucide-react";
import { Preahvihear } from "next/font/google";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";

export default function Discography ({
  params
} : {
  params: Promise<{artistId: string}>
}) {

  const { artistId } = use(params)

  const {
    discography, 
    artist, 
    active, 
    count, 
    artistLoad, 
    tableLoad,
    offset,
    fetchDiscog,
    error
  } = fetchDiscography(artistId)


  return (
    <div>

      <div className="mb-2">
        <p className="font-mono font-bold text-2xl">Discography</p>
      </div>
      
      <div className="mb-2">
        {!artistLoad ?  
          <>
            <p className="font-mono text-lg font-bold">{artist?.name}</p>
            <p className="font-mono text-sm">{artist?.disambiguation}</p>
          </>
        :
          <LoadingBox className="w-100 h-6"/>
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
        error ? (
          <div>
            <p>Error fetching {active}'s</p>
            <button>
              Refresh <RefreshCcw size={18}/>
            </button>
          </div>
        ) : (
          discography.length !== 0 ?
            <DiscographyTable discography={discography} active={active}/>
          :
            <div className="flex items-center justify-center font-mono mt-[5rem] gap-2 text-gray-500">
              <FileX2/> No data found
            </div>
        )  
      :
        <div className="flex flex-col gap-2">
          {Array.from({length: 15}).map((_, i) => (
            <LoadingBox className="w-full h-6"/>
          ))}
        </div>
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
  )
}