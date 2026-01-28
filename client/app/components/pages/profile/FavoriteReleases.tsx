import { ImageOff, Star, TriangleAlert } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function FavoriteReleases ({
  favs
} : {
  favs: FavRelease[] | null
}) {

  const router = useRouter()

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
          <button 
            key={i} 
            className="flex items-center gap-2 px-2 py-2 border bg-surface-elevated border-white/5 rounded interactive-button interactive-dark"
            onClick={() => router.push(`/release/${f.releaseId}`)}
          >
            <div
              className="w-20 h-20 overflow-hidden bg-surface flex items-center justify-center"
            >
              {f.release.coverArt ?
                <img 
                  src={f.release.coverArt} 
                  className="w-full h-full object-cover"
                />
              :
                <ImageOff className="text-white/5"/>
              }
            </div>
            <div
              className="text-left"
            >
              <p 
                className="font-mono font-semibold text-sm tracking-wide"
              >
                {f.release.title}
              </p>
              <div>
                {f.release.artistCredit.map((ac, i) =>
                  <p
                    key={i}
                    className="text-xs tracking-wide text-white/50"
                  >
                    {ac.name}{ac.joinphrase}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </li>
    </ul>
  )
}