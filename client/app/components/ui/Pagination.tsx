import { ApiData, ApiPageResponse } from "@/app/lib/types/api"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useRef } from "react"

export default function Pagination ({
  currentPage,
  totalPages,
  onPageChange
} : {
  currentPage: number
  totalPages: number
  onPageChange: (newPage: number) => void
}) {

  const pageRef = useRef<HTMLInputElement>(null)

  return (
    <div className="my-3 flex items-center gap-4 text-sm justify-center">
      {currentPage !== 1 &&
        <div
          className="hover:bg-gray-700 p-1 rounded-full cursor-pointer"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={18}/>
        </div>
      }
      <div className="flex gap-4 text-sm">
        {(() => {
          const pageCount = 10

          let start = currentPage - Math.floor(pageCount / 2)
          let end = currentPage + Math.floor(pageCount / 2) - 1

          if (start < 1) {
            end += 1 - start
            start = 1
          }

          if (end > totalPages) {
            start -= end - totalPages
            end = totalPages
          }

          if (start < 1) start = 1

          const pages = []
          for (let i = start; i <= end; i++) {
            pages.push(i)
          }

          return pages.map((page) => (
            <div
              key={page}
              onClick={() => onPageChange(page)}
              className={page === currentPage ? "font-bold text-teal-500" : "cursor-pointer hover:underline"}
            >
              {page}
            </div>
          ))
        })()}
      </div>    

      {(totalPages - 5) > currentPage &&
        <div className="flex gap-4">
          <p>...</p>
          <button
            className="cursor-pointer hover:underline"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </div>
      }

      {currentPage !== totalPages &&
        <div
          className="hover:bg-gray-700 p-1 rounded-full cursor-pointer"
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={18}/>
        </div>
      }
      
      {totalPages > 10 &&
        <div className="flex gap-2 items-center">
          <input 
            ref={pageRef}
            type="number" 
            className="border p-1 text-sm"
            min={1}
            max={totalPages}
          />
          <button
            className="p-1 rounded-full hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              const value = Number(pageRef.current?.value)
              if (!value || value < 1 || value > totalPages) return
              onPageChange(value)
            }}
          >
            <Search size={18}/>
          </button>
        </div>
      }
    </div>
  )
}