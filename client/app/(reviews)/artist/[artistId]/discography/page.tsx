'use client'

import DiscographyTable from "@/app/components/artist/DiscographyTable";
import Pagination from "@/app/components/artist/Pagination";
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar";
import LoadingBox from "@/app/components/ui/loading/loadingBox";
import LoadingText from "@/app/components/ui/loading/LoadingText";
import fetchDiscography from "@/app/hooks/musicbrainz/fetchDiscography";

import {FileX2, RefreshCcw } from "lucide-react";

import { use } from "react";

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
    tableLoad,
    offset,
    fetchDiscog,
    error
  } = fetchDiscography(artistId)

  return (
    <div className="flex flex-col h-full">

      <div className="mb-2">
        <p className="font-mono font-bold text-2xl">Discography</p>
      </div>
      
      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-bold">{artist?.name}</span>
          <span className="font-mono text-sm text-gray-500">{artist?.disambiguation}</span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-2">
        <ul className="text-lg font-bold flex flex-wrap list-none gap-3">
          <li 
            onClick={() => fetchDiscog(artistId, 'album')}
            className={`${active === 'album' ? 'border-teal-300 bg-teal-500/20 text-teal-300 border-b-4' : ''} px-2 py-1 cursor-pointer`}
          >
            Albums
          </li>
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
          <div className="p-2 flex flex-col items-center gap-2 font-mono">
            <p className="">{error}</p>
            <button 
              className="flex items-center gap-2 px-2 py-1 bg-teal-500 rounded text-black font-bold font-mono cursor-pointer"
              onClick={() => fetchDiscog(artistId, active, offset)}
            >
              Refresh <RefreshCcw size={18}/>
            </button>
          </div>
        ) : (
          discography.length !== 0 ?
            <>
              <DiscographyTable discography={discography} active={active}/>
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
            </>
            
          :
            <div className="flex items-center justify-center font-mono mt-[5rem] gap-2 text-gray-500">
              <FileX2/> No data found
            </div>
        )  
      :
        <IndeterminateLoadingBar bgColor="bg-teal-100" mainColor="bg-teal-500"/>
      }

          
          
    </div>
  )
}