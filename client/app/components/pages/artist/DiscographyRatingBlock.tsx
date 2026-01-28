import { ReleaseGroup } from "@/app/lib/types/api"

export default function DiscographyRatingBlock ({
  releaseGroup
} : {
  releaseGroup: ReleaseGroup
}) {

  const text = releaseGroup.totalReviews != null 
    ? releaseGroup.totalReviews === 0 
      ? '--'
      : releaseGroup.averageRating
    : 'N/A'

  return (
    <div
      className="rounded bg-opacity-40 border text-sm"
      style={{
        backgroundColor: releaseGroup.averageRating != null
          ? `hsl(${Math.min(Math.max((releaseGroup.averageRating - 1) * 30, 0), 240)}, 70%, 10%)`
          : undefined,
        border: releaseGroup.averageRating != null
          ? `1px solid hsl(${Math.min(Math.max((releaseGroup.averageRating - 1) * 30, 0), 240)}, 70%, 50%)`
          : '1px solid #6b7280',
        color: releaseGroup.averageRating != null
          ? `hsl(${Math.min(Math.max((releaseGroup.averageRating - 1) * 30, 0), 240)}, 70%, 50%)`
          : '#6b7280',
      }}
    >
      {text}
    </div>
  )
}