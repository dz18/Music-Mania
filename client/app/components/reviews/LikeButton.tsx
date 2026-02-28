import useFetchLikes from "@/app/hooks/api/likes/useFetchLikes"
import { MusicTypes } from "@/app/lib/types/api"
import { Heart, HeartCrack, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

export default function ({
  item, itemId, type, coverArt
} : {
  item: MusicTypes | null
  itemId: string
  type: 'artist' | 'release' | 'song',
  coverArt?: string
}) {

  const { status } = useSession()

  const { 
    isLiked, LikeData,
    like, unlike,
    isLiking, isUnliking, loadingLike
  } = useFetchLikes(itemId, type)

  const handleClick = async () => {
    if (status !== 'authenticated') return
    if (!item) return

    try {
      if (isLiked) {
        await unlike({
          itemId,
          type
        })
      } else {  
        await like({
          itemId, 
          type, 
          name: ('name' in item) ? item.name : null,
          title: ('title' in item) ? item.title : null,
          artistCredit: ('artistCredit' in item) ? item.artistCredit : null,
          coverArt: coverArt ?? null
        })
      }
    } catch (error) {
      console.error(error)
    } 

  }

  return (
    <button
      className={`
        group border px-2 py-1 rounded flex gap-2 items-center justify-center
        interactive-button 
        ${isLiked
            ? "border-pink-500 text-pink-500 hover:bg-red-950 hover:border-red-500 hover:text-red-500 active:bg-pink-800"
            : "hover:text-pink-300 hover:border-pink-300 hover:bg-pink-950 active:hover:bg-pink-800"
        }
      `}
      disabled={loadingLike}
      onClick={handleClick}
    >
      {/* Normal heart */}
      {isLiking || isUnliking ?
        <Loader2 size={18} className="animate-spin"/>
      :
        <>
          <Heart
            size={18}
            className={`
              ${isLiked ? "block group-hover:hidden fill-pink-500" : ""}
            `}
          />

          {/* Crack heart on hover */}
          {isLiked && (
            <HeartCrack
              size={18}
              className="hidden group-hover:block transition"
            />
          )}

          {/* Text */}
          {!isLiked && (
            <span>
              Like
            </span>
          )}

          {/* Text when liked */}
          {isLiked && (
            <>
              <span className="group-hover:hidden">
                Liked
              </span>
              <span className="hidden group-hover:block">
                Unlike
              </span>
            </>
          )}
        </>
      }
    </button>
  )
}