import { Album } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import axios from "axios";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

export default function Favorite ({
  item,
  type
} : {
  item: Artist | Album | null
  type: 'artist' | 'release' | 'song'
}) {

  const {data : session, update} = useSession()
  const [isPending, startTransition] = useTransition()
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    setFavorites(session?.user?.favArtists ?? [])
  }, [session?.user.favArtists])

  const isFavorite = useMemo(() => (
    item ? favorites.includes(item.id) : false
  ), [favorites, item])

  const updateFavorites = (id: string, action: 'add' | 'remove') => {
    setFavorites(prev => (
      action === 'add' ? [...prev, id] : prev.filter(f => f !== id)
    ))
  }

  const rollbackFavorites = (originalFavorites: string[]) => {
    setFavorites(originalFavorites);
  }

  const toggleFavorite = useCallback(async() => {
    if (!session?.user?.id  || !item) return

    const originalFavorites = [...favorites];
    const action = isFavorite ? 'remove' : 'add';
    const endpoint = isFavorite ? 'removeFavoriteArtist' : 'addFavoriteArtist';

    updateFavorites(item.id, action)

    startTransition(async () => {
      try {
        if (type === 'artist') {
          await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${endpoint}`, {
            userId: session.user.id,
            artistId: item.id,
            type: 'artist'
          })
        }

        const newFavorites = action === 'add' 
          ? [...originalFavorites, item.id]
          : originalFavorites.filter(id => id !== item.id);

        // console.log(newFavArtists)
        if (type === 'artist') {
          await update({...session, user: {...session.user, favArtists: newFavorites}})
        } else if (type === 'release') {
          await update({...session, user: {...session.user, favReleases: newFavorites}})
        } else if (type === 'song') {
          await update({...session, user: {...session.user, favSongs: newFavorites}})
        }

      } catch (error) {
        console.error(`Failed to ${action} favorite artist:`, error);
        rollbackFavorites(originalFavorites);
      }
    })

  }, [session, item, isFavorite, favorites, updateFavorites, rollbackFavorites, update])

  return (
    <>
      <button
        className="cursor-pointer disabled:opacity-50 disabled:cursor-default"
        title={`${isFavorite ? 'Unfavorite' : 'Favorite'}`}
        onClick={toggleFavorite}
        disabled={isPending}
      >
        <Heart 
          className={`${isPending ? 'animate-pulse' : 'hover:fill-pink-500/50'}  transition-colors duration-200 text-pink-500 ${isFavorite ? "fill-pink-500" : "hover:text-pink-500 fill-transparent"}`}
        />
      </button>
    </>
  )
}