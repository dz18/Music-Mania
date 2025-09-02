import { Album } from "@/app/lib/types/api"
import { useRouter } from "next/navigation"

export default function Tracklist ({
  album
} : {
  album: Album | null
}) {

  const router = useRouter()

  return (
    <div>
      <p className="font-bold text-xl mb-2">{album?.trackCount} {album?.trackCount === 1 ? 'Track' : 'Tracks'}</p>
      <table className="border-1 w-full">
        <thead>
          <tr className="bg-gray-800 border-b">
            <th className="py-1">Pos.</th>
            <th className="py-1 text-left">Title</th>
            <th className="py-1">length</th>
          </tr>
        </thead>
        <tbody>
          {album?.tracks.map((track, i) => {
            return (
              <tr
                key={track.id}
                className={`${i % 2 === 0 ? 'bg-gray-700 hover:bg-gray-700/80' : 'bg-gray-800 hover:bg-gray-800/80'} border-b border-white group`}
                onClick={() => router.push(`/song/${track.recording.id}`)}
              >
                <td className="px-3 py-2 text-right text-gray-400">{track.position}.</td>
                <td className="px-3 py-2 flex gap-1 cursor-pointer">
                  <p 
                    className="font-semibold truncate group-hover:underline cursor-pointer"
                  >
                    {track.recording.title}
                  </p>
                  {track.recording["artist-credit"].length > 1 && (
                    <p className="text-gray-300 text-sm items-center flex truncate">
                      {"ft. "}
                      {track.recording["artist-credit"].map((artist, j) => (
                        j !== 0 && `${artist.name}${artist.joinphrase || ""} `
                      ))}
                    </p>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  {Math.floor(track.recording.length / 1000 / 60)} mins {Math.floor((track.recording.length / 1000) % 60)} secs
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}