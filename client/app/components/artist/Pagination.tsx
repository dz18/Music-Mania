import { ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination ({
  artistId,
  active,
  offset,
  count,
  fetchDiscog,
  loading
} : {
  artistId: string
  active: "album" | "ep" | "single"
  offset: number
  count: number
  fetchDiscog: (artistId: string, type: "album" | "ep" | "single", offset?: number) => Promise<void>
  loading: boolean
}) {

  const limit = 25

  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(count / limit)

  return (
    <div className="flex gap-1 justify-center">
      <button 
        className={`cursor-pointer hover:text-teal-500/80 active:text-teal-500/60 disabled:text-gray-500 disabled:cursor-default`}
        disabled={offset === 0}
        onClick={() => fetchDiscog(artistId, active, offset - 25)}
      >
        <ChevronsLeft size={18}/>
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          className={`
            ${page === currentPage ? 'text-teal-500 font-bold underline' : 'hover:text-teal-500'} 
            p-1 cursor-pointer disabled:cursor-pointer`}
          onClick={() => fetchDiscog(artistId, active, (page - 1) * limit)}
          disabled={page === currentPage || loading}
        >
          {page}
        </button>
      ))}

      <button
        className={`cursor-pointer hover:text-teal-500/80 active:text-teal-500/60 disabled:text-gray-500 disabled:cursor-default`}
        disabled={offset + limit >= count}
        onClick={() => fetchDiscog(artistId, active, offset + 25)}
      >
        <ChevronsRight size={18}/>
      </button>
    </div>
  )
}