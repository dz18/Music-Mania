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
        className="interactive-button font-semibold text-sm text-orange-500 bg-orange-950 border border-orange-500 flex gap-2 rounded px-2 py-1 hover:bg-orange-900 active:bg-orange-800"
        onClick={func}
        disabled={loading}
      >
        Refresh Results <RefreshCcw size={18}/>
      </button>
      <p className="text-sm text-gray-500">{note}</p>
    </div>
  )
}