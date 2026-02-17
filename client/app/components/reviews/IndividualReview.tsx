import { useRouter } from "next/navigation"
import { useState } from "react"
import StarRatingVisual from "../ui/StarVisual"
import { timeAgo } from "@/app/hooks/timeAgo"

export default function IndividualReview({
  review,
  index
}: {
  review: UserArtistReview | UserReleaseReview | UserSongReview
  index: number
}) {
  const router = useRouter()

  const defaultAvatar = '/default-avatar.jpg'
  const initialAvatar = review.userId
    ? `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}/avatars/${review.userId}`
    : defaultAvatar

  const [avatarUrl, setAvatarUrl] = useState(initialAvatar)

  return (
    <div
      className={`${index % 2 === 0 ? "bg-surface" : ""} p-2`}
    >
      <div className="flex justify-between items-center">
        {/* User info */}
        <div className="flex items-center gap-2">
          <img
            src={avatarUrl}
            alt={`${review.user.username} avatar`}
            className="w-10 h-10 object-cover border-gray-500 border"
            loading="lazy"
            onError={() => setAvatarUrl(defaultAvatar)}
          />
          <div>
            <p
              className="font-mono text-sm font-semibold hover:underline cursor-pointer"
              onClick={() => router.push(`/profile/${review.userId}`)}
            >
              {review.user.username}
            </p>
            <p className="text-gray-500 text-sm">
              {timeAgo(review.createdAt)}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 font-mono font-semibold text-sm">
          {review.rating}
          <StarRatingVisual rating={Number(review.rating)} />
        </div>
      </div>

      {/* Review content */}
      {review.review && (
        <div className="text-sm mt-1 pt-1 border-t border-white/5">
          {review.title && <p className="font-semibold">{review.title}</p>}
          <p>{review.review}</p>
        </div>
      )}
    </div>
  )
}
