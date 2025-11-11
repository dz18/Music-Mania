import { RefreshCcw } from "lucide-react"

export default function RefreshPage ({
  func,
  title,
  loading,
  note
}: {
  func: () => Promise<void>
  title: string
  loading: boolean
  note?: string
}) {
  return (
    <div className="flex flex-1 min-h-full items-center justify-center flex-col font-mono gap-2">
      <p className="text-lg">{title}</p>
      <button
        className="text-black bg-teal-500 px-1 py-2 rounded font-mono font-bold flex items-center gap-2 cursor-pointer hover:bg-teal-500/80 active:bg-teal-500/60"
        onClick={func}
        disabled={loading}
      >
        Refresh Results <RefreshCcw size={18}/>
      </button>
      <p className="text-sm text-gray-500">{note}</p>
    </div>
  )
}