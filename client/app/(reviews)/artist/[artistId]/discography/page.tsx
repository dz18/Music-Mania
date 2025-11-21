'use client'

import DiscographyTable from "@/app/components/pages/artist/DiscographyTable";
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar";
import Pagination from "@/app/components/ui/Pagination";
import useFetchDiscography from "@/app/hooks/musicbrainz/useFetchDiscography";

import { FileX2, RefreshCcw } from "lucide-react";

import { use } from "react";

export default function Discography ({
  params
}: {
  params: Promise<{ artistId: string }>,
}) {

  const { artistId } = use(params)

  const {
    data,
    artist, 
    fetchData,
    tableLoad,
    error,
    active,
    setActive
  } = useFetchDiscography(artistId)

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
            className={`${active === 'album' ? 'border-teal-300 bg-teal-500/20 text-teal-300 border-b-4' : ''} px-2 py-1 cursor-pointer`}
            onClick={() => {
              setActive('album')
            }}
          >
            Albums
          </li>
          <li 
            className={`${active === 'ep' ? 'border-teal-300 bg-teal-500/20 text-teal-300 border-b-4' : ''} px-2 py-1 cursor-pointer`}
            onClick={() => {
              setActive('ep')
            }}
          >
            EPs
          </li>
          <li 
            className={`${active === 'single' ? 'border-teal-300 bg-teal-500/20 text-teal-300 border-b-4' : ''} px-2 py-1 cursor-pointer`}
            onClick={() => {
              setActive('single')
            }}
          >
            Singles
          </li>
        </ul>

        <p className="font-mono text-sm text-gray-500">
          {data?.count} total results
        </p>

      </div>
      
      
      {!tableLoad ?
        error ? (
          <div className="p-2 flex flex-col items-center gap-2 font-mono">
            <p className="">{error}</p>
            <button 
              className="flex items-center gap-2 px-2 py-1 bg-teal-500 rounded text-black font-bold font-mono cursor-pointer"
              onClick={() => fetchData()}
            >
              Refresh <RefreshCcw size={18}/>
            </button>
          </div>
        ) : (
          data && data?.data.length !== 0 ?
            <>
              <DiscographyTable discography={data.data} active={active}/>
              <Pagination data={data} fetchData={fetchData}/>
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