import useFetchFavorite from "@/app/hooks/api/favorites/useFetchFavorites";
import { Release } from "@/app/lib/types/api";
import { Artist } from "@/app/lib/types/artist";
import { Song } from "@/app/lib/types/song";
import { Heart, Loader, Loader2 } from "lucide-react";

export default function Favorite ({
  item,
  type,
  coverArtUrl
} : {
  item: Artist | Release | Song | null
  type: 'artist' | 'release' | 'song'
  coverArtUrl?: string
}) {

  const {
    isFavorite,
    isPending,
    toggleFavorite,
  } = useFetchFavorite(item, type, coverArtUrl)

  return (
    <>
      <button
        className="cursor-pointer disabled:opacity-50 disabled:cursor-default"
        title={`${isFavorite ? 'Unfavorite' : 'Favorite'}`}
        onClick={toggleFavorite}
        disabled={isPending}
      >
        {isPending ?
          <Loader2
            className="text-pink-500 animate-spin"
          />
        :
          <Heart 
            className={`transition-colors duration-200 text-pink-500 ${isFavorite ? "fill-pink-500" : "hover:text-pink-500 fill-transparent"}`}
          />
        }
      </button>
    </>
  )
}