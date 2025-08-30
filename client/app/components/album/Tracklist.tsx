import { Album } from "@/app/lib/types/api"

export default function Tracklist ({
  album
} : {
  album: Album | null
}) {
  return (
    <div>
      <p className="font-bold text-xl mb-2">{album?.trackCount} {album?.trackCount === 1 ? 'Track' : 'Tracks'}</p>
      <table className="border-1 w-full">
        <thead>
          <tr className="bg-gray-800 border-b border-">
            <th className="p-1">Pos.</th>
            <th className="text-left">Title</th>
            <th className="">length</th>
          </tr>
        </thead>
        <tbody>
          {album?.tracks.map((track, i) => (
            <tr
              key={track.id}
              className={`${i % 2 === 0 ? 'bg-gray-700 hover:bg-gray-700/80' : 'bg-gray-800 hover:bg-gray-800/80'} border-b border-white group `}
              onClick={() => alert(track.id)}
            >
              <td className="px-3 py-2 text-right text-gray-400">{track.position}.</td>
              <td className="px-3 py-2 flex gap-1 cursor-pointer">
                <p 
                  className="font-semibold truncate group-hover:underline cursor-pointer" 
                >{track.title}</p>
                {track["artist-credit"].length > 1 &&
                  <p className="text-gray-300 text-sm items-end flex truncate"> ft. 
                    {track["artist-credit"].map((artist, i) => (
                      i !== 0 && `${artist.name} ${artist.joinphrase}` 
                    ))}
                  </p>
                }
              </td>
              <td className="px-3 py-2">{track.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}