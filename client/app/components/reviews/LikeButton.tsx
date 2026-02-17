import { MusicTypes } from "@/app/lib/types/api"
import axios from "axios"
import { Heart, HeartCrack, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { Dispatch, SetStateAction, useState } from "react"

export default function ({
  item, itemId, like, setLike, type, coverArt
} : {
  item: MusicTypes | null
  itemId: string
  like: any
  setLike: Dispatch<SetStateAction<any>>
  type: 'artist' | 'release' | 'song',
  coverArt?: string
}) {

  const { data: session, status} = useSession()

  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (loading) return
    if (status !== 'authenticated') return
    if (!item) return

    try {
      setLoading(true)

      if (like) {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/like`, {
          data: { 
            itemId, 
            type
          },
          headers : {
            Authorization: `Bearer ${session?.user.token}`
          }
        })
        setLike(null)
      } else {  
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/like`, { 
          itemId, 
          type, 
          name: ('name' in item) ? item.name : null,
          title: ('title' in item) ? item.title : null,
          artistCredit: ('artistCredit' in item) ? item.artistCredit : null,
          coverArt: coverArt ?? null
        }, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`
          }
        })
        setLike(res.data.like)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }

  }

  return (
    <button
      className={`
        group border px-2 py-1 rounded flex gap-2 items-center justify-center
        interactive-button 
        ${like
            ? "border-pink-500 text-pink-500 hover:bg-red-950 hover:border-red-500 hover:text-red-500 active:bg-pink-800"
            : "hover:text-pink-300 hover:border-pink-300 hover:bg-pink-950 active:hover:bg-pink-800"
        }
      `}
      disabled={loading}
      onClick={handleClick}
    >
      {/* Normal heart */}
      {loading ?
        <Loader2 size={18} className="animate-spin"/>
      :
        <>
          <Heart
            size={18}
            className={`
              ${like ? "block group-hover:hidden fill-pink-500" : ""}
            `}
          />

          {/* Crack heart on hover */}
          {like && (
            <HeartCrack
              size={18}
              className="hidden group-hover:block transition"
            />
          )}

          {/* Text */}
          {!like && (
            <span>
              Like
            </span>
          )}

          {/* Text when liked */}
          {like && (
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