import { Release } from "@/app/lib/types/api"
import { useRouter } from "next/navigation"
import TracklistRatingsBlock from "./TracklistRatingsBlock"
import { Fragment } from "react/jsx-runtime"

export default function Tracklist ({
  album
} : {
  album: Release | null
}) {

  const router = useRouter()

  function formatDuration(ms: number | null | undefined) {
    if (!ms) return "—"

    const totalSeconds = Math.floor(ms / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60

    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div
      className="rounded-lg overflow-hidden border border-gray-500"
    >

      <div
        className="flex justify-between px-4 py-2 bg-surface-elevated text-sm font-mono font-semibold tracking-wide text-center"
      >
        <p>
          {album?.title}
        </p>
        <p
          className="text-gray-500"
        >
          {album?.media.reduce((sum, m) => sum + m.trackCount, 0)} total tracks
        </p>
      </div>

      <table
        className="table-fixed w-full"
      >
        <thead
          className="bg-surface"
        >
          <tr
            className="tracking-wide uppercase text-gray-400 text-xs"
          >
            <th className="px-4 py-2 w-20 text-right">Pos.</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 w-20 text-center">Length</th>
            <th className="px-4 py-2 w-20 text-center">Reviews</th>
            <th className="px-4 py-2 w-20 text-center">Rating</th>
          </tr>
        </thead>
        <tbody>
        {album?.media.map((media, mediaIndex) => (
          <Fragment key={mediaIndex}>
            {/* Optional disc header */}
            {album.media.length > 1 && (
              <tr className="bg-black/50 border-b border-white/5">
                <td colSpan={5} className="px-4 py-2 text-sm font-semibold opacity-60">
                  Disc {mediaIndex + 1}
                </td>
              </tr>
            )}

            {media.tracks.map((t, trackIndex) => (
              <tr
                key={`${mediaIndex}-${trackIndex}`}
                className={`
                  ${(trackIndex % 2 === 0) ? "" : "bg-surface"}
                  border-t border-b border-white/5
                  interactive-button interactive-dark
                  text-sm
                `}
                title={`View details for ${t.title}`}
                onClick={() => router.push(`/song/${t.recording.id}`)}
              >
                <td className="px-4 py-2 w-20 font-semibold text-right opacity-40">
                  {t.position}
                </td>

                <td className="px-4 py-2 text-left truncate">
                  {t.title}
                </td>

                <td className="px-4 py-2 w-20 text-center opacity-40">
                  {formatDuration(t.length)}
                </td>

                <td className="px-4 py-2 w-20 text-center opacity-40">
                  {t.recording.totalReviews}
                </td>

                <td
                  className={`
                    px-4 py-2 w-20 text-center font-semibold
                    ${t.recording.avgRating == null ? "text-gray-600" : "text-white"}
                    rounded-md
                  `}
                >
                  <TracklistRatingsBlock track={t} />
                </td>
              </tr>
            ))}
          </Fragment>
        ))}

        </tbody>
      </table>
    </div>
  )
}