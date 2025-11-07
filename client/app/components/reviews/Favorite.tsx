import { Release } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import { Song } from "@/app/lib/types/song";
import axios from "axios";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

export default function Favorite ({
  item,
  type,
  coverArtUrl
} : {
  item: Artist | Release | Song | null
  type: 'artist' | 'release' | 'song'
  coverArtUrl?: string
}) {

  const {data : session, update} = useSession()
  const [isPending, startTransition] = useTransition()
  const [favorites, setFavorites] = useState<{id: string, since: Date}[]>([])

  useEffect(() => {
    switch (type) {
      case 'artist' : 
        setFavorites(session?.user?.favArtists?.map(f => ({id: f.artistId, since: f.since})) ?? [])
        break
      case 'release' : 
        setFavorites(session?.user?.favReleases?.map(f => ({id: f.releaseId, since: f.since})) ?? [])
        break
      case 'song' : 
        setFavorites(session?.user?.favSongs?.map(f => ({id: f.songId, since: f.since})) ?? [])
        break
    }
  }, [type, session?.user.favArtists, session?.user?.favReleases, session?.user?.favSongs])

  const isFavorite = useMemo(() => (
    item ? favorites.some(fav => fav.id === item.id) : false
  ), [favorites, item])

  const updateFavorites = (
    id: string,
    action: 'add' | 'remove',
    since: Date
  ) => {
    if(!item) return
    setFavorites((prev) => {
      if (action === 'add') {
        return [...prev, {id: item.id, since}]
      }

      if (action === 'remove') {
        return prev.filter((f) => f.id !== id)
      }

      return prev
    })
  };

  const rollbackFavorites = (originalFavorites: {id: string, since: Date}[]) => {
    setFavorites(originalFavorites);
  }

  const toggleFavorite = useCallback(async() => {
    if (!session?.user?.id  || !item) return

    const originalFavorites = [...favorites];
    const action = isFavorite ? 'remove' : 'add';

    let artistCredit = 'artistCredit' in item ? item.artistCredit.map(ac => ({
      joinphrase: ac.joinphrase,
      name: ac.name
    })) : null

    const since = new Date()
    
    updateFavorites(item.id, action, since)

    startTransition(async () => {
      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/favorite`, {
          userId: session.user.id,
          id: item.id,
          name: 'name' in item ? item.name : null,
          title: 'title' in item ? item.title : null,
          artistCredit: 'artistCredit' in item ? artistCredit : null,
          type: type,
          since: since,
          action: action,
          coverArt: coverArtUrl
        })

        setFavorites(
          action === 'add'
            ? [...originalFavorites, {id: item.id, since}]
            : originalFavorites.filter(f => f.id !== item.id)
        )
        // console.log(newFavArtists)

        switch (type) {
          case 'artist': 
            await update({...session, user: {...session.user, favArtists: {userId: session.user.id, artistId: item.id, since}}})
            break
          case 'release': 
            await update({...session, user: {...session.user, favReleases: {userId: session.user.id, releaseId: item.id, since}}})
            break
          case 'song': 
            await update({...session, user: {...session.user, favSongs: {userId: session.user.id, songId: item.id, since}}})
            break
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