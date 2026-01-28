import { Track } from "@/app/lib/types/api"

export default function TracklistRatingsBlock ({
  track
} : {
  track: Track
}) {
  return (
    <div
      className="rounded bg-opacity-40 border"
      style={{
        backgroundColor: track.recording.avgRating != null
          ? `hsl(${Math.min(Math.max((track.recording.avgRating - 1) * 30, 0), 240)}, 70%, 10%)`
          : undefined,
        border: track.recording.avgRating != null
          ? `1px solid hsl(${Math.min(Math.max((track.recording.avgRating - 1) * 30, 0), 240)}, 70%, 50%)`
          : undefined,
        color: track.recording.avgRating != null
          ? `hsl(${Math.min(Math.max((track.recording.avgRating - 1) * 30, 0), 240)}, 70%, 50%)`
          : undefined,
      }}
    >
      {track.recording.avgRating != null ? track.recording.avgRating : 'N/A'}
    </div>
  )
}