'use client'

import DiscographyTable from "@/app/components/pages/artist/DiscographyTable"
import LoadingBox from "@/app/components/ui/loading/loadingBox"
import Pagination from "@/app/components/ui/Pagination"
import useFetchDiscography from "@/app/hooks/musicbrainz/useFetchDiscography"
import { DiscographyType } from "@/app/lib/types/discography"
import { FileX2, RefreshCcw } from "lucide-react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { use } from "react"

export default function Discography({ params }: { params: Promise<{ artistId: string }> }) {
  const { artistId } = use(params)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const {
    artist,
    discography,
    loadingArtist,
    loadingDiscography,
    error,
    active,
    page
  } = useFetchDiscography(artistId)

  const isLoading = loadingArtist || loadingDiscography

  const handleActiveChange = (newActive: DiscographyType) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('active', newActive)
    params.set('page', '1')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-col h-full">
      <p className="font-mono font-bold text-2xl mb-2">Discography</p>

      <div className="flex flex-col items-baseline mb-2">
        <p className="font-mono text-lg font-semibold">{artist?.name}</p>
        <p className="font-mono text-xs text-gray-400">{artist?.disambiguation}</p>
      </div>

      <div className="flex justify-between items-end mb-2">
        <ul className="text-lg font-bold flex flex-wrap list-none gap-3">
          {(['album', 'ep', 'single'] as DiscographyType[]).map(type => (
            <li
              key={type}
              className={`${active === type
                ? 'border-teal-300 bg-teal-500/20 text-teal-300 border-b-4'
                : 'interactive-button interactive-dark'
              } px-2 py-1`}
              onClick={() => handleActiveChange(type)}
            >
              {type === 'album' && 'Albums'}
              {type === 'ep' && 'EPs'}
              {type === 'single' && 'Singles'}
            </li>
          ))}
        </ul>

        <p className="font-mono text-sm text-gray-500">
          {discography?.count ?? 0} total results
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <LoadingBox className="h-40" />
          <LoadingBox className="h-40" />
          <LoadingBox className="h-40" />
        </div>
      ) : error ? (
        <div className="p-2 flex flex-col items-center gap-2 font-mono">
          <p className="text-sm font-semibold">Something went wrong loading discography.</p>
          <button
            className="interactive-button font-semibold text-sm text-orange-500 bg-orange-950 border border-orange-500 flex gap-2 rounded px-2 py-1 hover:bg-orange-900 active:bg-orange-800"
            onClick={() => location.reload()}
          >
            Refresh <RefreshCcw size={18} />
          </button>
        </div>
      ) : discography?.data.length ? (
        <>
          <DiscographyTable discography={discography.data} active={active} key={active}/>
          {discography.pages > 1 && (
            <Pagination totalPages={discography.pages} />
          )}
        </>
      ) : (
        <div className="flex items-center justify-center font-mono mt-20 gap-2 text-gray-500">
          <FileX2 /> No data found
        </div>
      )}
    </div>
  )
}