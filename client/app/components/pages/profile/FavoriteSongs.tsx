import { ImageOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FavoriteSongs ({
  favs
} : {
  favs: FavSong[] | null
}) {

  const router = useRouter()

  return (
    <ul className="list-none">
      <li className="flex items-center gap-2 flex-wrap">
        {favs?.map((f, i) => (
          <button 
            key={i} 
            className="flex items-center gap-2 px-2 py-2 border bg-surface-elevated border-white/5 rounded interactive-button interactive-dark"
            onClick={() => router.push(`/release/${f.songId}`)}
          >
            <div
              className="w-20 h-20 overflow-hidden bg-surface flex items-center justify-center"
            >
              {f.song.coverArt ?
                <img 
                  src={f.song.coverArt} 
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
                {f.song.title}
              </p>
              <div>
                {f.song.artistCredit.map((ac, i) =>
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