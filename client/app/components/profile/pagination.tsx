import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function Pagination ({
  results,
  setPage
} : {
  results: FollowersResponse | null,
  setPage: Dispatch<SetStateAction<number>>
}) {
  return (
    <div className="flex gap-2 justify-center">
      <button 
        className="p-1 rounded-full hover:bg-black/20"
        onClick={() => setPage(prev => prev - 1)}
        disabled={results?.page === 1}
      >
        <ChevronLeft size={18}/>
      </button>
      {Array.from({length: results?.pages ?? 0}, (_ , i) => i + 1).map(page => (
        <button
          key={page}
          className={`
            ${page === results?.page ? "text-teal-500 font-bold" : "cursor-pointer hover:underline"}
            text-sm font-mono
          `}
          disabled={page === results?.page}
          onClick={() => setPage(page)}
        >
          {page}
        </button>
      ))}
      <button 
        className="p-1 rounded-full hover:bg-black/20"
        onClick={() => setPage(prev => prev + 1)}
        disabled={results?.page === results?.pages}
      >
        <ChevronRight size={18}/>
      </button>
    </div>
  )
}