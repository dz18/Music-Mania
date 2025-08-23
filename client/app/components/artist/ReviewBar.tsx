import { FavoritesResponse } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import axios from "axios";
import { Heart, NotebookText, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState, useTransition } from "react";

export default function ReviewBar ({
  artist, 
} : {
  artist: Artist | null,
}) {

  const { data: session, update } = useSession()

  const [isPending, startTransition] = useTransition()
  const [favArtists, setFavArtists] = useState<string[]>([])

  useEffect(() => {
    setFavArtists(session?.user?.favArtists ?? [])
  }, [session?.user.favArtists])

  const isFavorite = useMemo(() => (
    artist ? favArtists.includes(artist.id) : false
  ), [favArtists, artist])

  const updateFavorites = (artistId: string, action: 'add' | 'remove') => {
    setFavArtists(prev => (
      action === 'add' ? [...prev, artistId] : prev.filter(id => id !== artistId)
    ))
  }

  const rollbackFavorites = (originalFavorites: string[]) => {
    setFavArtists(originalFavorites);
  }

  const toggleFavorite = useCallback(async() => {
    if (!session?.user?.id  || !artist) return

    const originalFavorites = [...favArtists];
    const action = isFavorite ? 'remove' : 'add';
    const endpoint = isFavorite ? 'removeFavoriteArtist' : 'addFavoriteArtist';

    updateFavorites(artist.id, action)

    startTransition(async () => {
      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${endpoint}`, {
          userId: session.user.id,
          artistId: artist.id
        })

        const newFavArtists = action === 'add' 
          ? [...originalFavorites, artist.id]
          : originalFavorites.filter(id => id !== artist.id);

        // console.log(newFavArtists)
        await update({...session, user: {...session.user, favArtists: newFavArtists}})

      } catch (error) {
        console.error(`Failed to ${action} favorite artist:`, error);
        rollbackFavorites(originalFavorites);
      }
    })

  }, [session, artist, isFavorite, favArtists, updateFavorites, rollbackFavorites, update])

  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <p className="inline-flex font-mono text-sm">Rate:</p>
        <div className="flex gap-1 items-center mt-1">
          <Star size={18} />
          <Star size={18} />
          <Star size={18} />
          <Star size={18} />
          <Star size={18} />
        </div>
      </div>
      <div className="flex text-sm font-mono items-center gap-2">
        <button className=" px-2 py-1 rounded cursor-pointer border hover:bg-teal-500/20 active:bg-teal-500/40 flex gap-1">
          <NotebookText size={18}/> Review
        </button>
        {artist && (
          <button
            className="cursor-pointer disabled:opacity-50 disabled:cursor-default"
            title={`${isFavorite ? 'Unfavorite' : 'Favorite'} ${artist.name}`}
            onClick={toggleFavorite}
            disabled={isPending}
          >
            <Heart 
              className={`${isPending ? 'animate-pulse' : 'hover:fill-pink-500/50'}  transition-colors duration-200 text-pink-500 ${isFavorite ? "fill-pink-500" : "hover:text-pink-500 fill-transparent"}`}
            />
          </button>
        )}
      </div>
    </div>
  )
}