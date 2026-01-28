import { Star, TriangleAlert } from "lucide-react"
import Link from "next/link"

export default function FavoriteArtists ({
  favs
} : {
  favs: FavArtist[] | null
}) {

  if (favs && favs?.length <= 0) {
    return (
      <p
        className="text-sm font-mono tracking-wide text-gray-500 flex gap-2 items-center"
      >
        <TriangleAlert className="" size={18}/> No Favorite Artists Yet
      </p> 
    )
  }

  return (
    <ul className="list-none">
      <li className="flex items-center gap-2 flex-wrap">
        {favs?.map((f, i) => (
          <span key={i} className="flex items-center gap-2">
            <Link 
              href={`/artist/${f.artistId}`}
              className="font-mono text-sm font-semibold hover:underline tracking-wide"
            >
              {f.artist.name}
            </Link>

            {i < favs.length - 1 && (
              <Star size={10} className="opacity-40" />
            )}
          </span>
        ))}
      </li>
    </ul>
  )
}