'use client'

import DiscographyTable from "@/app/components/pages/artist/DiscographyTable";
import IndeterminateLoadingBar from "@/app/components/ui/loading/IndeterminateLoadingBar";
import LoadingBox from "@/app/components/ui/loading/loadingBox";
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

      <p className="font-mono font-bold text-2xl mb-2">Discography</p>
    
      <div className="flex flex-col items-baseline mb-2">
        <p className="font-mono text-lg font-semibold">{artist?.name}</p>
        <p className="font-mono text-xs text-gray-400">{artist?.disambiguation}</p>
      </div>

      <div className="flex justify-between items-end mb-2">
        <ul className="text-lg font-bold flex flex-wrap list-none gap-3">
          <li 
            className={`${active === 'album' ? 'border-teal-300 bg-teal-500/20 text-teal-300 border-b-4' : 'interactive-button interactive-dark'} px-2 py-1`}
            onClick={() => {
              setActive('album')
            }}
          >
            Albums
          </li>
          <li 
            className={`${active === 'ep' ? 'border-teal-300 bg-teal-500/20 text-teal-300 border-b-4' : 'interactive-button interactive-dark'} px-2 py-1`}
            onClick={() => {
              setActive('ep')
            }}
          >
            EPs
          </li>
          <li 
            className={`${active === 'single' ? 'border-teal-300 bg-teal-500/20 text-teal-300 border-b-4' : 'interactive-button interactive-dark'} px-2 py-1`}
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
            <p className="text-sm font-semibold">{error}</p>
            <button 
              className="interactive-button font-semibold text-sm text-orange-500 bg-orange-950 border border-orange-500 flex gap-2 rounded px-2 py-1 hover:bg-orange-900 active:bg-orange-800"
              onClick={() => fetchData()}
            >
              Refresh <RefreshCcw size={18}/>
            </button>
          </div>
        ) : (
          data && data?.data.length !== 0 ?
            <>
              <DiscographyTable discography={data.data} active={active}/>            
              {data.count > data.limit && (
                <Pagination data={data} fetchData={fetchData} />
              )}   
            </>
            
          :
            <div className="flex items-center justify-center font-mono mt-20 gap-2 text-gray-500">
              <FileX2/> No data found
            </div>
        )  
      :
        <div className="flex flex-col gap-4">
          <LoadingBox className="h-40"/>
          <LoadingBox className="h-40"/>
          <LoadingBox className="h-40"/>
          <LoadingBox className="h-40"/>
        </div>
      }

          
          
    </div>
  )
}