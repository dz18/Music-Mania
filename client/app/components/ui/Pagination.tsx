import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useRef, useState, useEffect } from "react"

export default function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const pageRef = useRef<HTMLInputElement>(null)  
  const initialPage = Number(searchParams.get("page")) || 1
  const [page, setPage] = useState(initialPage)

  const onPageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (newPage) {
      params.set("page", `${newPage}`)
    } 

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1
    if (urlPage !== page) setPage(urlPage)
  }, [searchParams])

  const pageCount = 10
  let start = page - Math.floor(pageCount / 2)
  let end = page + Math.floor(pageCount / 2) - 1

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
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="my-3 flex items-center gap-4 text-sm justify-center">
      {/* Prev button */}
      {page !== 1 && (
        <div
          className="hover:bg-gray-700 p-1 rounded-full cursor-pointer"
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={18} />
        </div>
      )}

      {/* page numbers */}
      <div className="flex gap-4 text-sm">
        {pages.map((p) => (
          <div
            key={p}
            onClick={() => onPageChange(p)}
            className={p === page ? "font-bold text-teal-500" : "cursor-pointer hover:underline"}
          >
            {p}
          </div>
        ))}
      </div>

      {/* Ellipsis and last page */}
      {totalPages - 5 > page && (
        <div className="flex gap-4">
          <p>...</p>
          <button
            className="cursor-pointer hover:underline"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </div>
      )}

      {/* Next button */}
      {page !== totalPages && (
        <div
          className="hover:bg-gray-700 p-1 rounded-full cursor-pointer"
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={18} />
        </div>
      )}

      {/* Jump to page input */}
      {totalPages > 10 && (
        <div className="flex gap-2 items-center">
          <input ref={pageRef} type="number" className="border p-1 text-sm" min={1} max={totalPages} />
          <button
            className="p-1 rounded-full hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              const value = Number(pageRef.current?.value)
              if (!value || value < 1 || value > totalPages) return
              onPageChange(value)
            }}
          >
            <Search size={18} />
          </button>
        </div>
      )}
    </div>
  )
}